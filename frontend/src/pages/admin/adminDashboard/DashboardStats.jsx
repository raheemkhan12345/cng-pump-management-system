import React from 'react';
import {
    FaMoneyBillWave,
    FaBuilding,
    FaBookOpen,
    FaScaleBalanced,
} from 'react-icons/fa6';
import './DashboardStats.css';

// ==========================================
// Dashboard Stats Data
// ==========================================

const statsData = [
    {
        id: 1,
        label: 'TOTAL SALE',
        value: 'Rs. 245,500',
        subtext: 'Current balance in counter',
        icon: FaMoneyBillWave,
        variant: 'green-card',
    },
    {
        id: 2,
        label: 'TOTAL EXPENSES',
        value: 'Rs. 680,000',
        subtext: 'Across all accounts',
        icon: FaBuilding,
        variant: 'pink-card',
    },
    {
        id: 3,
        label: 'OWNER EXPENSE',
        value: 'Rs. 125,500',
        variant: 'white-card border-red',
        textVariant: 'text-red',
    },
    {
        id: 4,
        label: 'DAILY SALE',
        value: 'Rs. 245,500',
        subtext: 'Current balance',
        icon: FaMoneyBillWave,
        variant: 'green-card',
    },
    {
        id: 5,
        label: 'LOAN TO OTHERS',
        value: '55,000',
        subtext: 'Total receivable',
        variant: 'white-card border-pink',
        textVariant: 'text-orange',
    },
    {
        id: 6,
        label: 'LOAN FROM OTHERS',
        value: 'Rs. 38,500',
        subtext: 'Total outgoings to others',
        icon: FaBookOpen,
        variant: 'white-card border-red',
        textVariant: 'text-red',
        iconVariant: 'text-red',
    },
    {
        id: 7,
        label: 'DIESEL PURCHASED',
        value: 'Rs. 4500',
        dieselLiters: '10 liters',
        variant: 'pink-card',
        type: 'diesel',
    },
    {
        id: 8,
        label: 'TOTAL KG',
        value: '2,450 KG',
        subtext: 'Total volume dispensed',
        icon: FaScaleBalanced,
        variant: 'teal-card',
        type: 'wide',
    },
];

const DashboardStats = () => {
    return (
        <div className="stats-grid">
            {statsData.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.id}
                        className={`stat-card ${stat.variant} ${stat.type === 'wide' ? 'span-two-cols' : ''
                            }`}
                    >
                        {/* Card Header */}
                        <div className="card-header">
                            <span
                                className={`card-label ${stat.textVariant || ''
                                    }`}
                            >
                                {stat.label}
                            </span>

                            {Icon && (
                                <Icon
                                    className={`card-icon ${stat.iconVariant || ''
                                        }`}
                                />
                            )}
                        </div>

                        {/* Diesel Card */}
                        {stat.type === 'diesel' ? (
                            <div className="diesel-val-container">
                                <span className="card-amount">
                                    {stat.value}
                                </span>

                                <span className="diesel-liters">
                                    {stat.dieselLiters}
                                </span>
                            </div>
                        ) : (
                            <>
                                {/* Amount */}
                                <h2
                                    className={`card-amount ${stat.textVariant || ''
                                        }`}
                                >
                                    {stat.value}
                                </h2>

                                {/* Subtext */}
                                {stat.subtext && (
                                    <p className="card-subtext">
                                        {stat.subtext}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;