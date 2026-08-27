import React, { useState } from "react";
import { X } from "lucide-react";
import "./AddNewOwnerModal.css";

const AddNewOwnerModal = ({ isOpen, onClose, onSubmit }) => {
  const [ownerName, setOwnerName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ownerName.trim()) {
      if (onSubmit) {
        onSubmit({ ownerName });
      }
      setOwnerName("");
      onClose();
    }
  };

  return (
    <div className="anom-overlay">
      <div className="anom-modal-container">
        {/* Header */}
        <div className="anom-header">
          <h2 className="anom-title">Add New Owner</h2>
          <button className="anom-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="anom-form">
          <div className="anom-field">
            <label className="anom-label">Owner Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="anom-input"
              required
              autoFocus
            />
          </div>

          {/* Footer Actions */}
          <div className="anom-footer">
            <button type="button" className="anom-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="anom-btn-submit">
              Add Owner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewOwnerModal;
