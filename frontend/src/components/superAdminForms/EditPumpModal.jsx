import React, { useEffect, useState } from "react";

import { X, Save, Eye, EyeOff } from "lucide-react";

import { updateAdmin } from "../../services/superAdminDash";

import "./EditPumpModal.css";

const EditPumpModal = ({ isOpen, onClose, pumpData, onSave }) => {
  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    pumpName: "",
    pumpAddress: "",
    status: "active",
    adminName: "",
    email: "",
    password: "",
  });

  // =====================================================
  // ORIGINAL DATA
  // =====================================================

  const [originalData, setOriginalData] = useState({
    pumpName: "",
    pumpAddress: "",
    status: "active",
    adminName: "",
    email: "",
  });

  // =====================================================
  // UI STATES
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // POPULATE FORM
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    console.log("========================================");
    console.log("EDIT PUMP MODAL OPENED");
    console.log("========================================");

    console.log("Pump Data Received:", pumpData);

    if (!pumpData) {
      console.error("Edit Pump Error: pumpData is missing.");

      setError("Pump data is missing.");

      return;
    }

    // ===================================================
    // PUMP NAME
    // ===================================================

    const existingPumpName =
      pumpData?.pumpName ||
      pumpData?.pump?.pumpName ||
      pumpData?.stationName ||
      pumpData?.pump?.name ||
      pumpData?.name ||
      "";

    // ===================================================
    // PUMP ADDRESS
    // ===================================================

    const existingPumpAddress =
      pumpData?.pumpAddress ||
      pumpData?.pump?.pumpAddress ||
      pumpData?.address ||
      pumpData?.location ||
      "";

    // ===================================================
    // STATUS
    // ===================================================

    const existingStatus =
      pumpData?.status ||
      pumpData?.pumpStatus ||
      pumpData?.pump?.status ||
      "active";

    // ===================================================
    // ADMIN NAME
    // ===================================================

    const existingAdminName =
      pumpData?.admin?.name ||
      pumpData?.adminName ||
      pumpData?.fullName ||
      pumpData?.username ||
      pumpData?.name ||
      "";

    // ===================================================
    // EMAIL
    // ===================================================

    const existingEmail =
      pumpData?.admin?.email || pumpData?.email || pumpData?.adminEmail || "";

    // ===================================================
    // NORMALIZE STATUS
    // ===================================================

    const normalizedStatus =
      String(existingStatus).toLowerCase() === "inactive" ||
      String(existingStatus).toLowerCase() === "in active"
        ? "inactive"
        : "active";

    // ===================================================
    // ORIGINAL VALUES
    // ===================================================

    const existingValues = {
      pumpName: String(existingPumpName).trim(),

      pumpAddress: String(existingPumpAddress).trim(),

      status: normalizedStatus,

      adminName: String(existingAdminName).trim(),

      email: String(existingEmail).trim(),
    };

    console.log("Existing Values:", existingValues);

    // ===================================================
    // FORM DATA
    // ===================================================

    setFormData({
      ...existingValues,

      // Existing password is NEVER loaded
      password: "",
    });

    // ===================================================
    // SAVE ORIGINAL DATA
    // ===================================================

    setOriginalData(existingValues);

    setShowPassword(false);

    setError("");
  }, [pumpData, isOpen]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Input Changed: ${name}`, value);

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (status) => {
    if (isUpdating) {
      return;
    }

    console.log("Status Changed:", status);

    setFormData((previous) => ({
      ...previous,

      status,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {
    if (isUpdating) {
      console.warn("Modal close blocked. Update is in progress.");

      return;
    }

    console.log("Edit Pump Modal Closed.");

    setError("");

    setShowPassword(false);

    onClose?.();
  };

  // =====================================================
  // GET ADMIN ID
  // =====================================================

  const getAdminId = () => {
    /*
     * Backend update route:
     *
     * PUT /admins/updateAdmin/:id
     *
     * Prefer Admin ID first.
     */

    return (
      pumpData?.admin?._id ||
      pumpData?.admin?.id ||
      pumpData?.adminId ||
      pumpData?._id ||
      pumpData?.id ||
      null
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========================================");
    console.log("UPDATE PUMP SUBMITTED");
    console.log("========================================");

    if (isUpdating) {
      console.warn("Update already in progress.");

      return;
    }

    setError("");

    // ===================================================
    // GET ADMIN ID
    // ===================================================

    const adminId = getAdminId();

    console.log("Admin ID:", adminId);

    if (!adminId) {
      const message = "Admin ID is missing. Cannot update.";

      console.error(message);

      setError(message);

      return;
    }

    // ===================================================
    // CURRENT VALUES
    // ===================================================

    const currentPumpName = formData.pumpName.trim();

    const currentPumpAddress = formData.pumpAddress.trim();

    const currentStatus = formData.status;

    const currentAdminName = formData.adminName.trim();

    const currentEmail = formData.email.trim();

    const currentPassword = formData.password.trim();

    // ===================================================
    // VALIDATION
    // ===================================================

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

    // ===================================================
    // CREATE UPDATE DATA
    // =====================================================

    /*
     * IMPORTANT:
     *
     * Sirf changed fields request mein jayengi.
     */

    const updateData = {};

    // ===================================================
    // PUMP NAME
    // ===================================================

    if (currentPumpName !== originalData.pumpName) {
      updateData.pumpName = currentPumpName;
    }

    // ===================================================
    // PUMP ADDRESS
    // ===================================================

    if (currentPumpAddress !== originalData.pumpAddress) {
      updateData.pumpAddress = currentPumpAddress;
    }

    // ===================================================
    // STATUS
    // ===================================================

    if (currentStatus !== originalData.status) {
      updateData.status = currentStatus;
    }

    // ===================================================
    // ADMIN NAME
    // ===================================================

    if (currentAdminName !== originalData.adminName) {
      updateData.adminName = currentAdminName;
    }

    // ===================================================
    // EMAIL
    // ===================================================

    if (currentEmail !== originalData.email) {
      updateData.email = currentEmail;
    }

    // ===================================================
    // PASSWORD
    // ===================================================

    /*
     * Password blank hai:
     *
     * Request mein nahi jayega.
     *
     * Password enter kiya:
     *
     * Request mein jayega.
     */

    if (currentPassword) {
      updateData.password = currentPassword;
    }

    // ===================================================
    // CHANGED FIELDS
    // ===================================================

    const changedFields = Object.keys(updateData);

    console.log("========================================");
    console.log("CHANGED FIELDS");
    console.log("========================================");

    console.log("Changed Fields:", changedFields);

    console.log("Update Data:", {
      ...updateData,

      ...(updateData.password
        ? {
            password: "[HIDDEN]",
          }
        : {}),
    });

    // ===================================================
    // NO CHANGES
    // ===================================================

    if (changedFields.length === 0) {
      console.warn("No changes were made.");

      setError("No changes were made.");

      return;
    }

    // ===================================================
    // API CALL
    // ===================================================

    try {
      setIsUpdating(true);

      console.log("========================================");
      console.log("CALLING UPDATE ADMIN API");
      console.log("========================================");

      console.log("Admin ID:", adminId);

      console.log("Endpoint:", `/admins/updateAdmin/${adminId}`);

      console.log("Payload:", {
        ...updateData,

        ...(updateData.password
          ? {
              password: "[HIDDEN]",
            }
          : {}),
      });

      // =================================================
      // API CALL
      // =================================================

      const response = await updateAdmin(adminId, updateData);

      console.log("========================================");
      console.log("UPDATE ADMIN SUCCESS");
      console.log("========================================");

      console.log("API Response:", response);

      // =================================================
      // SUCCESS CHECK
      // =================================================

      if (response?.success === false) {
        throw new Error(response?.message || "Failed to update admin.");
      }

      // =================================================
      // GET UPDATED RESULT
      // =================================================

      const updatedResult = response?.admin ||
        response?.data?.admin ||
        response?.data || {
          ...pumpData,

          ...updateData,

          _id: adminId,
        };

      console.log("Updated Result:", updatedResult);

      // =================================================
      // PARENT CALLBACK
      // =================================================

      if (onSave) {
        await onSave(updatedResult, changedFields);
      }

      // =================================================
      // CLOSE MODAL
      // =================================================

      onClose?.();
    } catch (err) {
      console.error("========================================");
      console.error("UPDATE ADMIN API ERROR");
      console.error("========================================");

      console.error("Full Error:", err);

      console.error("Response:", err?.response);

      console.error("Response Data:", err?.response?.data);

      console.error("Status:", err?.response?.status);

      console.error("Status Text:", err?.response?.statusText);

      console.error("Request URL:", err?.config?.url);

      console.error("Request Method:", err?.config?.method);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update admin.";

      console.error("Final Error Message:", message);

      setError(message);
    } finally {
      console.log("Update request finished.");

      setIsUpdating(false);
    }
  };

  // =====================================================
  // DO NOT RENDER
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="edit-modal-overlay" onClick={handleClose}>
      <div
        className="edit-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================
            HEADER
        ================================================ */}

        <div className="edit-modal-header">
          <h2>Edit Pump</h2>

          <button
            type="button"
            className="edit-modal-close-btn"
            onClick={handleClose}
            disabled={isUpdating}
          >
            <X size={18} />
          </button>
        </div>

        {/* ================================================
            ERROR
        ================================================ */}

        {error && <div className="edit-modal-error">{error}</div>}

        {/* ================================================
            FORM
        ================================================ */}

        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="edit-modal-body">
            {/* ==========================================
                PUMP NAME
            ========================================== */}

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

            {/* ==========================================
                ADDRESS
            ========================================== */}

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

            {/* ==========================================
                STATUS
            ========================================== */}

            <div className="edit-form-group">
              <label>Pump Status</label>

              <div className="status-toggle-container">
                <button
                  type="button"
                  className={`status-btn ${
                    formData.status === "Active" ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                >
                  Active
                </button>

                <button
                  type="button"
                  className={`status-btn ${
                    formData.status === "Inactive" ? "inactive" : ""
                  }`}
                  onClick={() => handleStatusChange("inactive")}
                  disabled={isUpdating}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* ==========================================
                ADMIN NAME
            ========================================== */}

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

            {/* ==========================================
                EMAIL
            ========================================== */}

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

            {/* ==========================================
                PASSWORD
            ========================================== */}

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

          {/* ==============================================
              FOOTER
          ============================================== */}

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
