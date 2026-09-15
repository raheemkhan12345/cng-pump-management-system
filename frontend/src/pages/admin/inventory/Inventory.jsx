import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import AddInventoryModal from "../../../components/adminDashboardForms/addInventoryModal/AddInventoryModal";
import EditInventoryModal from "../../../components/adminDashboardForms/EditInventoryModal/EditInventoryModal";

import {
  createInventory,
  getAllInventory,
  updateInventory,
} from "../../../services/adminApis/inventoryApi";

import "./Inventory.css";

const ITEMS_PER_PAGE = 5;

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Get inventory items
  const fetchInventory = async () => {
    try {
      setIsLoading(true);

      const response = await getAllInventory();

      console.log("Inventory API Response:", response);

      const items =
        response?.data || response?.inventory || response?.items || [];

      if (!Array.isArray(items)) {
        throw new Error("Invalid inventory data received from server.");
      }

      const formattedItems = items.map((item) => ({
        id: item._id || item.id,
        itemName: item.itemName || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
        remarks: item.remarks || "",
      }));

      setInventoryItems(formattedItems);
    } catch (error) {
      console.error("Fetch Inventory Error:", error?.response?.data || error);

      alert(
        error?.response?.data?.message ||
          "Unable to load inventory. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInventory = async () => {
      fetchInventory();
    };
    loadInventory();
  }, []);

  // Pagination
  const totalPages = Math.ceil(inventoryItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return inventoryItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [inventoryItems, currentPage]);

  const startEntry =
    inventoryItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(
    currentPage * ITEMS_PER_PAGE,
    inventoryItems.length,
  );

  // Add inventory item
  const handleAddNewItem = () => {
    setSelectedItem(null);
    setIsEditModalOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      const payload = {
        itemName: formData.itemName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks?.trim() || "N/A",
      };

      console.log("Create Inventory Payload:", payload);

      const response = await createInventory(payload);

      console.log("Create Inventory Response:", response);

      await fetchInventory();

      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Create Inventory Error:", error?.response?.data || error);

      alert(
        error?.response?.data?.message ||
          "Unable to add inventory item. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit inventory item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isSubmitting) return;

    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleEditFormSubmit = async (formData) => {
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);

      const updatedItem = {
        itemName: formData.itemName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        remarks: formData.remarks?.trim() || "N/A",
      };

      console.log("ID:", selectedItem.id);
      console.log("Payload:", updatedItem);

      await updateInventory(selectedItem.id, updatedItem);

      await fetchInventory();

      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Update Inventory Error:", error?.response?.data || error);

      alert(
        error?.response?.data?.message || "Unable to update inventory item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete inventory item
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?",
    );

    if (!confirmDelete) return;

    try {
      setInventoryItems((prevItems) =>
        prevItems.filter((item) => item.id !== id),
      );

      const remainingItems = inventoryItems.length - 1;

      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingItems / ITEMS_PER_PAGE),
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Delete Inventory Error:", error);

      alert("Unable to delete inventory item. Please try again.");
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="inv-container">
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="inv-empty-state">
                    Loading inventory...
                  </td>
                </tr>
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="inv-font-medium">{item.itemName}</td>

                    <td>Rs. {item.price.toLocaleString("en-PK")}</td>

                    <td>
                      <span
                        className={`inv-qty-badge ${
                          item.quantity <= 2 ? "low-stock" : ""
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>

                    <td className="inv-text-muted">{item.remarks || "Null"}</td>

                    <td className="inv-text-right">
                      <div className="inv-actions">
                        <button
                          type="button"
                          className="inv-action-btn edit"
                          title="Edit Item"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit2 size={16} />
                        </button>

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
                  <td colSpan="5" className="inv-empty-state">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {inventoryItems.length > 0 && (
          <div className="inv-pagination-wrapper">
            <span className="inv-entries-info">
              Showing {startEntry} to {endEntry} of {inventoryItems.length}{" "}
              entries
            </span>

            <div className="inv-pagination">
              <button
                type="button"
                className="inv-page-btn nav-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Prev
              </button>

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

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <EditInventoryModal
        key={selectedItem?.id || "edit-inventory"}
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
