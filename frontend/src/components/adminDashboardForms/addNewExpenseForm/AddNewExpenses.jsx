import React, { useState } from 'react';
import { X, Calendar, CreditCard, Building2, Plus, Banknote } from 'lucide-react';
import './AddNewExpenses.css';

const AddNewExpenses = ({ isOpen, onClose }) => {
    const [paymentMode, setPaymentMode] = useState('cash');

    if (!isOpen) return null;

    return (
        <div className="ane-modal-overlay">
            <div className="ane-modal-container">

                {/* Header */}
                <div className="ane-modal-header">
                    <div className="ane-header-info">
                        <div className="ane-header-icon-box">
                            <Banknote size={20} className="ane-header-icon" />
                        </div>
                        <div>
                            <h2 className="ane-modal-title">Record New Expense</h2>
                            <p className="ane-modal-subtitle">Log an outgoing payment or operational cost.</p>
                        </div>
                    </div>
                    <button className="ane-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body Form */}
                <div className="ane-modal-body">
                    {/* Row 1: Date & Amount */}
                    <div className="ane-form-row">
                        <div className="ane-form-group">
                            <label className="ane-label">Date</label>
                            <div className="ane-input-icon-wrapper">
                                <input type="date" defaultValue="2023-10-27" className="ane-input" />
                                <Calendar size={18} className="ane-input-icon" />
                            </div>
                        </div>

                        <div className="ane-form-group">
                            <label className="ane-label">Amount (PKR)</label>
                            <div className="ane-amount-wrapper">
                                <span className="ane-currency-prefix">Rs.</span>
                                <input type="number" placeholder="0.00" className="ane-input ane-input-amount" />
                            </div>
                        </div>
                    </div>

                    {/* Expense Category */}
                    <div className="ane-form-group">
                        <label className="ane-label">Expense Category</label>
                        <select className="ane-select" defaultValue="">
                            <option value="" disabled>Select a category...</option>
                            <option value="supplies">Supplies</option>
                            <option value="utility">Utility</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>

                    {/* Payment Mode / Pool */}
                    <div className="ane-form-group">
                        <label className="ane-label">Payment Mode / Pool</label>
                        <div className="ane-payment-grid">

                            <div
                                className={`ane-payment-card ${paymentMode === 'cash' ? 'ane-active' : ''}`}
                                onClick={() => setPaymentMode('cash')}
                            >
                                <div className="ane-card-left">
                                    <CreditCard size={20} className="ane-card-icon" />
                                    <div>
                                        <span className="ane-card-title">Cash Account</span>
                                        <span className="ane-card-sub">Hand Pool</span>
                                    </div>
                                </div>
                                {paymentMode === 'cash' && (
                                    <div className="ane-check-badge">✓</div>
                                )}
                            </div>

                            <div
                                className={`ane-payment-card ${paymentMode === 'bank' ? 'ane-active' : ''}`}
                                onClick={() => setPaymentMode('bank')}
                            >
                                <div className="ane-card-left">
                                    <Building2 size={20} className="ane-card-icon" />
                                    <div>
                                        <span className="ane-card-title">Bank Account</span>
                                        <span className="ane-card-sub">Reserve Pool</span>
                                    </div>
                                </div>
                                {paymentMode === 'bank' && (
                                    <div className="ane-check-badge">✓</div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Status */}
                    <div className="ane-form-group">
                        <label className="ane-label">Status</label>
                        <select className="ane-select" defaultValue="Paid">
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>

                    {/* Detail / Remarks */}
                    <div className="ane-form-group">
                        <label className="ane-label">Detail / Remarks</label>
                        <textarea
                            rows="3"
                            placeholder="Enter any additional details about this expense..."
                            className="ane-textarea"
                        ></textarea>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="ane-modal-footer">
                    <button className="ane-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="ane-btn-submit">
                        <Plus size={16} />
                        <span>Record Expense</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddNewExpenses;