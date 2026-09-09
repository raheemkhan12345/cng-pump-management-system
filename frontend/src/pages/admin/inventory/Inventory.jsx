import React, { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import AddInventoryModal from "../../../components/adminDashboardForms/addInventoryModal/AddInventoryModal";
import EditInventoryModal from "../../../components/adminDashboardForms/EditInventoryModal/EditInventoryModal";

import "./Inventory.css";

const ITEMS_PER_PAGE = 5;

const Inventory = () => {
  // =========================================================
  // INVENTORY DATA
  // =========================================================

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

  // =========================================================
  // ADD MODAL STATE
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================================================
  // EDIT MODAL STATE
  // =========================================================

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Currently selected item for editing
  const [selectedItem, setSelectedItem] = useState(null);

  // =========================================================
  // SUBMITTING STATE
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // TOTAL PAGES
  // =========================================================

  const totalPages = Math.ceil(inventoryItems.length / ITEMS_PER_PAGE);

  // =========================================================
  // PAGINATED DATA
  // =========================================================

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return inventoryItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [inventoryItems, currentPage]);

  // =========================================================
  // ENTRY INFORMATION
  // =========================================================

  const startEntry =
    inventoryItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(
    currentPage * ITEMS_PER_PAGE,
    inventoryItems.length,
  );

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const handleAddNewItem = () => {
    // Make sure edit modal is closed
    setIsEditModalOpen(false);

    // Clear selected item
    setSelectedItem(null);

    // Open Add Modal
    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
  };

  // =========================================================
  // ADD NEW ITEM
  // =========================================================

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // ---------------------------------------------
      // API call yahan future mein ayegi
      // ---------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 500));

      const newItem = {
        id: Date.now(),
        itemName: formData.itemName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks?.trim() || "",
      };

      setInventoryItems((prev) => [...prev, newItem]);

      // New item add hone ke baad last page par jao
      const newTotalPages = Math.ceil(
        (inventoryItems.length + 1) / ITEMS_PER_PAGE,
      );

      setCurrentPage(newTotalPages);

      // Close Add Modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Add inventory item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEditItem = (item) => {
    // Selected item save karo
    setSelectedItem(item);

    // Make sure Add modal closed ho
    setIsModalOpen(false);

    // Edit modal open
    setIsEditModalOpen(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEditModal = () => {
    if (isSubmitting) return;

    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  // =========================================================
  // UPDATE EXISTING ITEM
  // =========================================================

  const handleEditFormSubmit = async (formData) => {
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);

      // ---------------------------------------------
      // API PUT/PATCH call future mein yahan ayegi
      // ---------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedItem = {
        itemName: formData.itemName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks?.trim() || "",
      };

      // Existing item update
      setInventoryItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                ...updatedItem,
              }
            : item,
        ),
      );

      // Close Edit Modal
      setIsEditModalOpen(false);

      // Clear selected item
      setSelectedItem(null);
    } catch (error) {
      console.error("Update inventory item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // DELETE ITEM
  // =========================================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?",
    );

    if (!confirmDelete) return;

    setInventoryItems((prev) => prev.filter((item) => item.id !== id));

    // Remaining items calculate
    const remainingItems = inventoryItems.length - 1;

    // New total pages
    const newTotalPages = Math.max(
      1,
      Math.ceil(remainingItems / ITEMS_PER_PAGE),
    );

    // Agar current page available nahi rahi
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // =========================================================
  // NEXT PAGE
  // =========================================================

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="inv-container">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="inv-header-section">
        <div>
          <h2 className="inv-title">Inventory</h2>

          <p className="inv-subtitle">
            Manage station supplies and spare parts.
          </p>
        </div>

        <button
          type="button"
          className="inv-add-btn"
          onClick={handleAddNewItem}
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {/* =====================================================
          TABLE CARD
      ====================================================== */}

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
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    {/* ITEM NAME */}

                    <td className="inv-font-medium">{item.itemName}</td>

                    {/* PRICE */}

                    <td>Rs. {Number(item.price).toLocaleString("en-PK")}</td>

                    {/* QUANTITY */}

                    <td>
                      <span
                        className={`inv-qty-badge ${
                          item.quantity <= 2 ? "low-stock" : ""
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>

                    {/* REMARKS */}

                    <td className="inv-text-muted">{item.remarks || "-"}</td>

                    {/* ACTIONS */}

                    <td className="inv-text-right">
                      <div className="inv-actions">
                        {/* EDIT */}

                        <button
                          type="button"
                          className="inv-action-btn edit"
                          title="Edit Item"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="inv-action-btn delete"
                          title="Delete Item"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        ==================================================== */}

        {inventoryItems.length > 0 && (
          <div className="inv-pagination-wrapper">
            <span className="inv-entries-info">
              Showing {startEntry} to {endEntry} of {inventoryItems.length}{" "}
              entries
            </span>

            <div className="inv-pagination">
              {/* PREVIOUS */}

              <button
                type="button"
                className="inv-page-btn nav-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              {/* PAGE NUMBERS */}

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`inv-page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}

              <button
                type="button"
                className="inv-page-btn nav-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          ADD INVENTORY MODAL
      ====================================================== */}

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* =====================================================
          EDIT INVENTORY MODAL
      ====================================================== */}

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleEditFormSubmit}
        isSubmitting={isSubmitting}
        initialData={selectedItem}
      />
    </div>
  );
};

export default Inventory;
