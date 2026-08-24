import React, { useState } from 'react';
import { X, Calendar, User, Wallet, Landmark, Save } from 'lucide-react';
import './RecordLoanModel.css';

const RecordLoanModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        loanType: 'Loan Given',
        personName: '',
        status: 'Active',
        amount: '',
        paymentMode: 'cash', // 'cash' or 'bank'
        remarks: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Header */}
                <div className="modal-header">
                    <h2>Record New Loan</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        {/* Date */}
                        <div className="form-group">
                            <label>DATE</label>
                            <div className="input-with-icon">
                                <Calendar size={18} className="input-icon" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Loan Type */}
                        <div className="form-group">
                            <label>LOAN TYPE</label>
                            <select
                                name="loanType"
                                value={formData.loanType}
                                onChange={handleChange}
                            >
                                <option value="Loan Given">Loan Given</option>
                                <option value="Loan Received">Loan Received</option>
                            </select>
                        </div>

                        {/* Person / Company */}
                        <div className="form-group">
                            <label>PERSON / COMPANY</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="personName"
                                    placeholder="Enter name or company..."
                                    value={formData.personName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>STATUS</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="form-group full-width">
                            <label>AMOUNT (PKR)</label>
                            <div className="amount-input-box">
                                <span className="currency-prefix">Rs.</span>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Mode / Pool */}
                        <div className="form-group full-width">
                            <label>PAYMENT MODE / POOL</label>
                            <div className="payment-options">
                                <div
                                    className={`payment-card ${formData.paymentMode === 'cash' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMode: 'cash' }))}
                                >
                                    <Wallet size={20} />
                                    <div>
                                        <strong>Cash Account</strong>
                                        <p>Hand Pool</p>
                                    </div>
                                </div>

                                <div
                                    className={`payment-card ${formData.paymentMode === 'bank' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMode: 'bank' }))}
                                >
                                    <Landmark size={20} />
                                    <div>
                                        <strong>Bank Account</strong>
                                        <p>Reserve Pool</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail / Remarks */}
                        <div className="form-group full-width">
                            <label>DETAIL / REMARKS</label>
                            <textarea
                                name="remarks"
                                rows="3"
                                placeholder="Add any relevant notes or details about this loan..."
                                value={formData.remarks}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            <Save size={16} /> Record Loan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordLoanModal;