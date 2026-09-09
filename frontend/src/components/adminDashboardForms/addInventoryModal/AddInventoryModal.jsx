import React, { useState } from "react";
import { X } from "lucide-react";
import "./AddInventoryModal.css";

const AddInventoryModal = ({ isOpen, onClose, onSave, isSubmitting }) => {
  const getDefaultFormData = () => ({
    itemName: "",
    price: "",
    quantity: "1",
    remarks: "",
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.itemName.trim() || !formData.price || !formData.quantity) {
      return;
    }
    if (onSave) {
      onSave({
        itemName: formData.itemName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks.trim(),
      });
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData(getDefaultFormData());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="aim-overlay">
      <div className="aim-container">
        {/* HEADER */}
        <div className="aim-header">
          <h2>Add Inventory Item</h2>
          <button
            type="button"
            className="aim-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="aim-body">
          <div className="aim-form-grid">
            {/* ITEM NAME */}
            <div className="aim-form-group aim-full-width">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Dispenser Nozzle"
                value={formData.itemName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* PRICE (PKR) */}
            <div className="aim-form-group">
              <label>Price (PKR)</label>
              <div className="aim-amount-box">
                <span className="aim-currency-prefix">Rs.</span>
                <input
                  type="number"
                  name="price"
                  placeholder="15000"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="aim-form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="4"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* REMARKS */}
            <div className="aim-form-group aim-full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                placeholder="Spare for bay 2"
                rows="4"
                value={formData.remarks}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="aim-footer">
            <button
              type="button"
              className="aim-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="aim-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryModal;
