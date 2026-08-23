import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router Navigation
import { PlusCircle, FileText, Banknote, Fuel, CheckCircle2, TrendingUp } from 'lucide-react';
import './CngSales.css';
import RecordNewSaleModal from '../../../components/adminDashboardForms/recordNewSaleForm/RecordNewSaleModel';

const CngSales = () => {
    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
    const navigate = useNavigate(); // Navigation instance

    const salesStats = {
        todaySales: 125500,
        salesIncreasePercentage: 12,
        todayKgSold: 2450,
        status: 'On track',
    };

    const handleOpenNewSaleModal = () => {
        setIsNewSaleModalOpen(true);
    };

    const handleCloseNewSaleModal = () => {
        setIsNewSaleModalOpen(false);
    };

    // Sales Report Page Navigation Handler
    const handleViewReports = () => {
        navigate('/admin/sales-report'); // Apne Router ke according path adjust kar sakte hain
    };

    return (
        <div className="cng-sales-page-container">
            <div className="cng-sales-content-wrapper">

                {/* Top Action Buttons */}
                <div className="cng-sales-action-bar">
                    <button className="cng-btn-primary-record" onClick={handleOpenNewSaleModal}>
                        <PlusCircle size={20} />
                        <span>Record New Sale</span>
                    </button>

                    <button className="cng-btn-secondary-reports" onClick={handleViewReports}>
                        <FileText size={20} />
                        <span>View Sales Report</span>
                    </button>
                </div>

                {/* Sales Stats Cards Grid */}
                <div className="cng-sales-stats-grid">
                    <div className="cng-stat-card cng-sale-card">
                        <div className="cng-card-header">
                            <span className="cng-card-label">Today's Total Sales</span>
                            <Banknote className="cng-card-icon" size={24} strokeWidth={1.5} />
                        </div>
                        <div className="cng-card-body">
                            <h2 className="cng-card-amount">Rs. {salesStats.todaySales.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="cng-card-footer cng-footer-positive">
                            <TrendingUp size={16} />
                            <span>+{salesStats.salesIncreasePercentage}% vs yesterday</span>
                        </div>
                    </div>

                    <div className="cng-stat-card cng-kg-card">
                        <div className="cng-card-header">
                            <span className="cng-card-label">Total KG Sold</span>
                            <Fuel className="cng-card-icon" size={24} strokeWidth={1.5} />
                        </div>
                        <div className="cng-card-body">
                            <h2 className="cng-card-amount">{salesStats.todayKgSold.toLocaleString('en-IN')} KG</h2>
                        </div>
                        <div className="cng-card-footer cng-footer-status-green">
                            <CheckCircle2 size={16} />
                            <span>{salesStats.status}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <RecordNewSaleModal
                isOpen={isNewSaleModalOpen}
                onClose={handleCloseNewSaleModal}
            />
        </div>
    );
};

export default CngSales;