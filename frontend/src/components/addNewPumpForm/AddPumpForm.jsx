import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { createAdmin } from "../../services/superAdminDash";
import "./AddPumpForm.css";

const AddPumpModal = ({ isOpen, onClose, onAddPump }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    pumpName: "",
    pumpAddress: "",
    adminName: "",
    email: "",
    password: "",
  });

  if (!isOpen) {
    return null;
  }

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      pumpName: "",
      pumpAddress: "",
      adminName: "",
      email: "",
      password: "",
    });

    setShowPassword(false);
  };

  // Close Modal
  const handleClose = () => {
    if (isLoading) return;

    resetForm();
    onClose();
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (
      !formData.pumpName.trim() ||
      !formData.pumpAddress.trim() ||
      !formData.adminName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      window.alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await createAdmin(formData);

      // Handle unsuccessful API response
      if (response?.success === false) {
        throw new Error(response?.message || "Failed to create pump.");
      }

      // Send created data to parent
      if (onAddPump) {
        onAddPump(formData, response);
      }

      // Reset and close modal after success
      resetForm();
      onClose();
    } catch (error) {
      console.error("Create Pump Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        "Failed to create pump. Please try again.";

      // Show backend error in browser alert
      window.alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add New Pump</h2>

          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Pump Name */}
          <div className="form-group">
            <label>Pump Name</label>

            <input
              type="text"
              name="pumpName"
              placeholder="e.g. Al-Noor CNG Station"
              value={formData.pumpName}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Pump Address */}
          <div className="form-group">
            <label>Pump Address</label>

            <input
              type="text"
              name="pumpAddress"
              placeholder="e.g. Peshawar Tehkal"
              value={formData.pumpAddress}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Admin Name + Email */}
          <div className="form-row-2col">
            <div className="form-group">
              <label>Admin Name</label>

              <input
                type="text"
                name="adminName"
                placeholder="e.g. Zubair Ahmed"
                value={formData.adminName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="e.g. admin@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Pump"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPumpModal;
