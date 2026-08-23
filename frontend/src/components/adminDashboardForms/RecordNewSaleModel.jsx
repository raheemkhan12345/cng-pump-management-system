import React, { useState } from 'react';
import {
    FaXmark,
    FaCalendarDays,
    FaBuildingColumns,
    FaMoneyBillWave,
    FaFloppyDisk
} from 'react-icons/fa6';
import './RecordNewSaleModel.css';

const RecordNewSaleModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Form States
    const [date, setDate] = useState('2026-08-20');
    const [cngVolume, setCngVolume] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('cash'); // 'bank' or 'cash'
    const [remarks, setRemarks] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            date,
            cngVolume,
            amount,
            paymentMode,
            remarks
        };
        console.log('Recorded Sale Data:', formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Header */}
                <div className="modal-header">
                    <h2>Record New Sale</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaXmark />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Date Field */}
                    <div className="form-group">
                        <label>Date</label>
                        <div className="input-icon-wrapper">
                            <FaCalendarDays className="field-icon" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* CNG Volume & Amount Grid */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>CNG Volume (KG)</label>
                            <div className="input-icon-wrapper">
                                <span className="custom-icon">⚖️</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={cngVolume}
                                    onChange={(e) => setCngVolume(e.target.value)}
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Amount (PKR)</label>
                            <div className="input-prefix-wrapper">
                                <span className="prefix">Rs.</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="form-group">
                        <label>Payment Mode</label>
                        <div className="payment-toggle-grid">
                            <button
                                type="button"
                                className={`payment-btn ${paymentMode === 'bank' ? 'active' : ''}`}
                                onClick={() => setPaymentMode('bank')}
                            >
                                <FaBuildingColumns />
                                <span>Bank Account</span>
                            </button>

                            <button
                                type="button"
                                className={`payment-btn ${paymentMode === 'cash' ? 'active' : ''}`}
                                onClick={() => setPaymentMode('cash')}
                            >
                                <FaMoneyBillWave />
                                <span>Cash Amount</span>
                            </button>
                        </div>
                    </div>

                    {/* Detail / Remarks */}
                    <div className="form-group">
                        <label>Detail / Remarks</label>
                        <textarea
                            rows="3"
                            placeholder="Add any relevant notes..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Modal Footer / Actions */}
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            <FaFloppyDisk />
                            <span>Record Sale</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordNewSaleModal;