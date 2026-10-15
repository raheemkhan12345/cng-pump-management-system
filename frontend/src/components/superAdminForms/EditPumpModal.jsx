import { useState, useEffect } from "react";
import { X, Save, Eye, EyeOff } from "lucide-react";

import { updateAdmin } from "../../services/superAdminDash";
import "./EditPumpModal.css";

// =====================================================
// NORMALIZE STATUS
// =====================================================

const normalizeStatus = (status) => {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  if (normalized === "inactive" || normalized === "in active") {
    return "inactive";
  }

  return "active";
};

// =====================================================
// GET PUMP FORM DATA
// =====================================================

const getPumpFormData = (pumpData) => {
  const existingPumpName =
    pumpData?.pumpName ||
    pumpData?.pump?.pumpName ||
    pumpData?.stationName ||
    pumpData?.pump?.name ||
    pumpData?.name ||
    "";

  const existingPumpAddress =
    pumpData?.pumpAddress ||
    pumpData?.pump?.pumpAddress ||
    pumpData?.address ||
    pumpData?.location ||
    "";

  const existingStatus =
    pumpData?.status ??
    pumpData?.pumpStatus ??
    pumpData?.pump?.status ??
    "active";

  const existingAdminName =
    pumpData?.admin?.name ||
    pumpData?.adminName ||
    pumpData?.fullName ||
    pumpData?.username ||
    "";

  const existingEmail =
    pumpData?.admin?.email || pumpData?.email || pumpData?.adminEmail || "";

  return {
    pumpName: String(existingPumpName).trim(),
    pumpAddress: String(existingPumpAddress).trim(),
    status: normalizeStatus(existingStatus),
    adminName: String(existingAdminName).trim(),
    email: String(existingEmail).trim(),
    password: "",
  };
};

// =====================================================
// GET ORIGINAL DATA
// =====================================================

const getOriginalData = (data) => ({
  pumpName: data.pumpName,
  pumpAddress: data.pumpAddress,
  status: data.status,
  adminName: data.adminName,
  email: data.email,
});

// =====================================================
// EDIT PUMP MODAL
// =====================================================

const EditPumpModal = ({ isOpen, onClose, pumpData, onSave }) => {
  // ===================================================
  // FORM STATE
  // ===================================================

  const [formData, setFormData] = useState(() => getPumpFormData(pumpData));

  const [originalData, setOriginalData] = useState(() =>
    getOriginalData(getPumpFormData(pumpData)),
  );

  // ===================================================
  // UI STATES
  // ===================================================

  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // REFRESH FORM WHEN MODAL OPENS OR PUMP CHANGES
  // ===================================================

  useEffect(() => {
    if (!isOpen || !pumpData) {
      return;
    }

    const data = getPumpFormData(pumpData);

    setFormData(data);
    setOriginalData(getOriginalData(data));
    setShowPassword(false);
    setError("");
  }, [isOpen, pumpData]);

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ===================================================
  // STATUS CHANGE
  // ===================================================

  const handleStatusChange = (status) => {
    if (isUpdating) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      status: normalizeStatus(status),
    }));

    setError("");
  };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const handleClose = () => {
    if (isUpdating) {
      return;
    }

    setError("");
    setShowPassword(false);

    onClose?.();
  };

  // ===================================================
  // GET ADMIN ID
  // ===================================================

  const getAdminId = () => {
    return (
      pumpData?.admin?._id ||
      pumpData?.admin?.id ||
      pumpData?.adminId ||
      pumpData?._id ||
      pumpData?.id ||
      null
    );
  };

  // ===================================================
  // SUBMIT FORM
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      return;
    }

    setError("");

    // -------------------------------------------------
    // ADMIN ID
    // -------------------------------------------------

    const adminId = getAdminId();

    if (!adminId) {
      setError("Admin ID is missing. Cannot update.");
      return;
    }

    // -------------------------------------------------
    // CURRENT VALUES
    // -------------------------------------------------

    const currentPumpName = formData.pumpName.trim();
    const currentPumpAddress = formData.pumpAddress.trim();
    const currentStatus = normalizeStatus(formData.status);
    const currentAdminName = formData.adminName.trim();
    const currentEmail = formData.email.trim();
    const currentPassword = formData.password.trim();

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!currentPumpName) {
      setError("Please enter pump name.");
      return;
    }

    if (!currentAdminName) {
      setError("Please enter admin name.");
      return;
    }

    if (!currentEmail) {
      setError("Please enter admin email.");
      return;
    }

    // -------------------------------------------------
    // BUILD UPDATE PAYLOAD
    // -------------------------------------------------

    const updateData = {};

    if (currentPumpName !== originalData.pumpName) {
      updateData.pumpName = currentPumpName;
    }

    if (currentPumpAddress !== originalData.pumpAddress) {
      updateData.pumpAddress = currentPumpAddress;
    }

    // Always include the currently selected status.
    // This avoids skipping the status because of stale
    // originalData state.
    updateData.status = currentStatus;

    if (currentAdminName !== originalData.adminName) {
      updateData.adminName = currentAdminName;
    }

    if (currentEmail !== originalData.email) {
      updateData.email = currentEmail;
    }

    // Only send a password if the user entered one.
    if (currentPassword) {
      updateData.password = currentPassword;
    }

    // -------------------------------------------------
    // NO CHANGES
    // -------------------------------------------------

    const hasNonStatusChanges = Object.keys(updateData).some(
      (key) => key !== "status",
    );

    const statusChanged = currentStatus !== originalData.status;

    if (!hasNonStatusChanges && !statusChanged) {
      setError("No changes were made.");
      return;
    }

    // -------------------------------------------------
    // API REQUEST
    // -------------------------------------------------

    try {
      setIsUpdating(true);

      const response = await updateAdmin(adminId, updateData);

      if (response?.success === false || response?.status === false) {
        throw new Error(response?.message || "Failed to update admin.");
      }

      // -------------------------------------------------
      // UPDATED RESULT
      // -------------------------------------------------

      const updatedResult = response?.admin ||
        response?.data?.admin ||
        response?.data || {
          ...pumpData,
          ...updateData,
          _id: adminId,
        };

      // -------------------------------------------------
      // UPDATE PARENT DATA
      // -------------------------------------------------

      if (onSave) {
        await onSave(updatedResult, Object.keys(updateData));
      }

      // -------------------------------------------------
      // CLOSE MODAL
      // -------------------------------------------------

      onClose?.();
    } catch (err) {
      console.error("Update admin failed:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update admin.";

      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ===================================================
  // DO NOT RENDER
  // ===================================================

  if (!isOpen) {
    return null;
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="edit-modal-overlay" onClick={handleClose}>
      <div
        className="edit-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="edit-modal-header">
          <h2>Edit Pump</h2>

          <button
            type="button"
            className="edit-modal-close-btn"
            onClick={handleClose}
            disabled={isUpdating}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ERROR */}

        {error && <div className="edit-modal-error">{error}</div>}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="edit-modal-body">
            {/* PUMP NAME */}

            <div className="edit-form-group">
              <label htmlFor="pumpName">Pump Name</label>

              <input
                type="text"
                id="pumpName"
                name="pumpName"
                value={formData.pumpName}
                onChange={handleChange}
                placeholder="e.g. Al-Noor CNG Station"
                required
                disabled={isUpdating}
              />
            </div>

            {/* PUMP ADDRESS */}

            <div className="edit-form-group">
              <label htmlFor="pumpAddress">Pump Address</label>

              <input
                type="text"
                id="pumpAddress"
                name="pumpAddress"
                value={formData.pumpAddress}
                onChange={handleChange}
                placeholder="e.g. Peshawar Tehkal"
                disabled={isUpdating}
              />
            </div>

            {/* PUMP STATUS */}

            <div className="edit-form-group">
              <label>Pump Status</label>

              <div className="status-toggle-container">
                <button
                  type="button"
                  className={`status-btn ${
                    formData.status === "active" ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                  aria-pressed={formData.status === "active"}
                >
                  Active
                </button>

                <button
                  type="button"
                  className={`status-btn ${
                    formData.status === "inactive" ? "inactive" : ""
                  }`}
                  onClick={() => handleStatusChange("inactive")}
                  disabled={isUpdating}
                  aria-pressed={formData.status === "inactive"}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* ADMIN NAME */}

            <div className="edit-form-group">
              <label htmlFor="adminName">Admin Name</label>

              <input
                type="text"
                id="adminName"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="e.g. Zubair Ahmed"
                required
                disabled={isUpdating}
              />
            </div>

            {/* EMAIL */}

            <div className="edit-form-group">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. admin@gmail.com"
                required
                disabled={isUpdating}
              />
            </div>

            {/* PASSWORD */}

            <div className="edit-form-group">
              <label htmlFor="password">New Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  disabled={isUpdating}
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={isUpdating}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="edit-modal-footer">
            <button
              type="button"
              className="btn-edit-cancel"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-edit-save"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="edit-loading-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPumpModal;
