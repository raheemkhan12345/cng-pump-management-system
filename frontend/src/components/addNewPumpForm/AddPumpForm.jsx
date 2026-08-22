import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import './AddPumpForm.css';

const AddPumpModal = ({ isOpen, onClose, onAddPump }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    pumpName: '',
    pumpAddress: '',
    adminName: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddPump) onAddPump(formData);
    setFormData({
      pumpName: '',
      pumpAddress: '',
      adminName: '',
      email: '',
      password: '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Pump</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Pump Name</label>
            <input
              type="text"
              name="pumpName"
              placeholder="e.g. Al-Noor CNG Station"
              value={formData.pumpName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pump Address</label>
            <input
              type="text"
              name="pumpAddress"
              placeholder="e.g. Peshawar Tehkal"
              value={formData.pumpAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label>Admin Name</label>
              <input
                type="text"
                name="adminName"
                placeholder="e.g. Zubair Ahmed"
                value={formData.adminName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. alnoor_admin"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Pump
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPumpModal;