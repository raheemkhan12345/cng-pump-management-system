import { useState } from "react";
import { X } from "lucide-react";
import "./EditInventoryModal.css";

const EditInventoryModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    itemName: initialData?.itemName || "",
    price: initialData?.price ?? "",
    quantity: initialData?.quantity ?? "",
    remarks: initialData?.remarks || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="eim-overlay">
      <div className="eim-modal-container">
        <div className="eim-header">
          <h2 className="eim-title">Edit Inventory Item</h2>

          <button
            type="button"
            className="eim-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="eim-form">
          <div className="eim-body">
            {/* Item Name */}
            <div className="eim-field">
              <label className="eim-label">Item Name</label>

              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Dispenser Nozzle"
                className="eim-input"
                required
              />
            </div>

            {/* Price + Quantity */}
            <div className="eim-grid-2">
              <div className="eim-field">
                <label className="eim-label">Price (PKR)</label>

                <div className="eim-input-prefix-wrapper">
                  <span className="eim-prefix">Rs.</span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="15000"
                    className="eim-input eim-input-prefixed"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="eim-field">
                <label className="eim-label">Quantity</label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="4"
                  className="eim-input"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="eim-field">
              <label className="eim-label">Remarks</label>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Spare for bay 2"
                className="eim-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="eim-footer">
            <button
              type="button"
              className="eim-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="eim-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventoryModal;
