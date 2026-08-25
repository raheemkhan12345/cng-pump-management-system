import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import './EditAdminModal.css';

const EditAdminModal = ({ isOpen, onClose, adminData, onSave }) => {
    // Local form state
    const [formData, setFormData] = useState({
        adminName: '',
        email: '',
        password: '',
    });

    // Password visibility toggle state
    const [showPassword, setShowPassword] = useState(false);

    // Populate modal with existing admin data when opened
    useEffect(() => {
        if (adminData) {
            setFormData({
                adminName: adminData.name || 'Muhammad Usman',
                email: adminData.email || 'usman_cng',
                password: adminData.password || 'password123',
            });
        }
    }, [adminData, isOpen]);

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        onClose();
    };

    // Do not render modal if not open
    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div
                className="edit-modal-container"
                onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing
            >
                {/* Modal Header */}
                <div className="edit-modal-header">
                    <h2>Edit Admin User</h2>
                    <button
                        type="button"
                        className="edit-modal-close-btn"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSubmit} className="edit-modal-form">
                    <div className="edit-modal-body">
                        {/* Admin Name Input */}
                        <div className="edit-form-group">
                            <label htmlFor="adminName">Admin Name</label>
                            <input
                                type="text"
                                id="adminName"
                                name="adminName"
                                value={formData.adminName}
                                onChange={handleChange}
                                placeholder="Enter admin name"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="edit-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        {/* Password Input with Eye Icon */}
                        <div className="edit-form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="edit-modal-footer">
                        <button
                            type="button"
                            className="btn-edit-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-edit-save">
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdminModal;