import React, { useState } from 'react';
import {
    FaPlus,
    FaRightLeft,
    FaCoins,
    FaBookOpen,
    FaMoneyBillWave,
    FaBuildingColumns,
} from 'react-icons/fa6';
import './DashboardActionsOverview.css';
import NewSaleModal from '../../../components/adminDashboardForms/RecordNewSaleModel'; // Modal ko import karein

const quickActions = [
    {
        id: 1,
        label: 'New Sale',
        icon: FaPlus,
        className: 'btn-green',
        actionType: 'NEW_SALE', // Action identify karne ke liye add kiya
    },
    {
        id: 2,
        label: 'Cash Transfer',
        icon: FaRightLeft,
        className: 'btn-gray',
    },
    {
        id: 3,
        label: 'Loan Transaction',
        icon: FaCoins,
        className: 'btn-gray',
    },
    {
        id: 4,
        label: 'View Ledger',
        icon: FaBookOpen,
        className: 'btn-gray',
    },
];

const salesOverview = [
    { id: 1, label: "Today's Sales", value: 'Rs. 125,500' },
    { id: 2, label: 'CNG KG Sold', value: '2,450 KG' },
];

const cashBankStatus = [
    { id: 1, label: 'Cash', value: 'Rs. 245,500', icon: FaMoneyBillWave },
    { id: 2, label: 'Bank', value: 'Rs. 680,000', icon: FaBuildingColumns },
];

const recentTransfer = {
    label: 'Recent Transfer',
    value: 'Rs. 50,000 to Bank',
};

const DashboardActionsOverview = () => {
    // Modal state
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

    const handleActionClick = (actionType) => {
        if (actionType === 'NEW_SALE') {
            setIsSaleModalOpen(true);
        }
    };

    return (
        <div className="actions-overview-container">
            <div className="dashboard-section-card">
                <h3 className="section-title">Quick Actions</h3>

                <div className="quick-actions-grid">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <button
                                key={action.id}
                                className={`qa-btn ${action.className}`}
                                onClick={() => handleActionClick(action.actionType)}
                            >
                                <Icon />
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="overview-split-grid">
                <div className="dashboard-section-card">
                    <h3 className="section-title">CNG Sales Overview</h3>
                    <div className="overview-list">
                        {salesOverview.map((item) => (
                            <div className="overview-row" key={item.id}>
                                <span className="overview-label">{item.label}</span>
                                <span className="overview-val font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section-card">
                    <h3 className="section-title">Cash & Bank Status</h3>
                    <div className="overview-list">
                        {cashBankStatus.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div className="overview-row" key={item.id}>
                                    <span className="overview-label">
                                        <Icon className="status-icon" />
                                        {item.label}
                                    </span>
                                    <span className="overview-val font-bold">{item.value}</span>
                                </div>
                            );
                        })}
                        <div className="overview-divider"></div>
                        <div className="overview-row recent-transfer-row">
                            <span className="overview-sublabel">{recentTransfer.label}</span>
                            <span className="badge-transfer-green">{recentTransfer.value}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render New Sale Modal Component */}
            <NewSaleModal
                isOpen={isSaleModalOpen}
                onClose={() => setIsSaleModalOpen(false)}
            />
        </div>
    );
};

export default DashboardActionsOverview;