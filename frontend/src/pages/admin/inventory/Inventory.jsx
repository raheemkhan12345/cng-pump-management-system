import React, { useState } from "react";
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import EditInventoryModal from "../../../components/adminDashboardForms/EditInventoryModal/EditInventoryModal";
import "./Inventory.css";

const Inventory = () => {
  // Initial inventory sample data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      itemName: "Dispenser Nozzle",
      price: 15000,
      quantity: 4,
      remarks: "Spare for bay 2",
    },
    {
      id: 2,
      itemName: "Compressor Oil",
      price: 8500,
      quantity: 1,
      remarks: "Low stock, order soon",
    },
    {
      id: 3,
      itemName: "O-Ring Kit",
      price: 2200,
      quantity: 12,
      remarks: "Standard maintenance kit",
    },
    {
      id: 4,
      itemName: "High Pressure Gauge",
      price: 12000,
      quantity: 3,
      remarks: "Calibrated",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Open Modal for Adding New Item
  const handleAddNewItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  // Open Modal for Editing Existing Item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle Save (Both Add & Edit)
  const handleFormSubmit = (formData) => {
    if (selectedItem) {
      // Update Existing Item
      setInventoryItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                itemName: formData.itemName,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                remarks: formData.remarks,
              }
            : item,
        ),
      );
    } else {
      // Add New Item
      const newItem = {
        id: Date.now(),
        itemName: formData.itemName,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks,
      };
      setInventoryItems((prev) => [...prev, newItem]);
    }
  };

  const handleDelete = (id) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="inv-container">
      {/* Top Page Sub-Header */}
      <div className="inv-top-bar">
        <div>
          <h1 className="inv-page-title">CNG Sales</h1>
          <p className="inv-page-subtitle">
            Manage and record gas sales • Mingora, Swat
          </p>
        </div>
      </div>

      {/* Inventory Section Header */}
      <div className="inv-header-section">
        <div>
          <h2 className="inv-title">Inventory</h2>
          <p className="inv-subtitle">
            Manage station supplies and spare parts.
          </p>
        </div>
        <button className="inv-add-btn" onClick={handleAddNewItem}>
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="inv-card">
        <div className="inv-table-responsive">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price (PKR)</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th className="inv-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td className="inv-font-medium">{item.itemName}</td>
                  <td>Rs. {Number(item.price).toLocaleString()}</td>
                  <td>
                    <span
                      className={`inv-qty-badge ${
                        item.quantity <= 2 ? "low-stock" : ""
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="inv-text-muted">{item.remarks}</td>
                  <td className="inv-text-right">
                    <div className="inv-actions">
                      <button
                        className="inv-action-btn edit"
                        title="Edit Item"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="inv-action-btn delete"
                        title="Delete Item"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="inv-pagination-wrapper">
          <span className="inv-entries-info">
            Showing 1 to {inventoryItems.length} of {inventoryItems.length}{" "}
            entries
          </span>
          <div className="inv-pagination">
            <button className="inv-page-btn nav-btn" disabled>
              Prev
            </button>
            <button className="inv-page-btn active">1</button>
            <button className="inv-page-btn">2</button>
            <button className="inv-page-btn">3</button>
            <button className="inv-page-btn nav-btn">Next</button>
          </div>
        </div>
      </div>

      {/* Edit / Add Inventory Modal Component */}
      <EditInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
      />
    </div>
  );
};

export default Inventory;
