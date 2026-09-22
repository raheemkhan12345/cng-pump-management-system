import {
    FaMoneyBillWave,
    FaScaleBalanced,
    FaBookOpen,
    FaBuilding,
} from 'react-icons/fa6';
import './DashboardStats.css';

const statsData = [
    {
        id: 1,
        label: 'TOTAL SALE',
        value: 'Rs. 245,500',
        subtext: 'Current balance in counter',
        icon: FaMoneyBillWave,
        variant: 'card-green',
    },
    {
        id: 2,
        label: 'TOTAL KG',
        value: '2,450 KG',
        subtext: 'Total volume dispensed',
        icon: FaScaleBalanced,
        variant: 'card-teal',
    },
    {
        id: 3,
        label: 'DAILY SALE',
        value: 'Rs. 245,500',
        subtext: 'KG. 365kg',
        icon: FaMoneyBillWave,
        variant: 'card-green',
        subtextBold: true,
    },
    {
        id: 4,
        label: 'DIESEL PURCHASED',
        value: 'Rs. 4500',
        subtext: '10 liters',
        variant: 'card-pink',
        subtextLarge: true,
    },
    {
        id: 5,
        label: 'LOAN TO OTHERS',
        value: '55,000',
        subtext: 'Total receivable',
        variant: 'card-grey accent-border-red',
        textVariant: 'text-red',
    },
    {
        id: 6,
        label: 'LOAN FROM OTHERS',
        value: 'Rs. 38,500',
        subtext: 'Total outgoings to others',
        icon: FaBookOpen,
        variant: 'card-grey accent-border-red',
        textVariant: 'text-red',
        iconVariant: 'text-red',
    },
    {
        id: 7,
        label: 'TOTAL EXPENSES',
        value: 'Rs. 680,000',
        subtext: 'Across all accounts',
        icon: FaBuilding,
        variant: 'card-pink',
    },
    {
        id: 8,
        label: 'OWNER EXPENSE',
        value: 'Rs. 10',
        variant: 'card-grey accent-border-red',
        textVariant: 'text-red',
    },
];

const DashboardStats = () => {
    return (
        <div className="stats-grid">
            {statsData.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div key={stat.id} className={`stat-card ${stat.variant}`}>
                        {/* Header / Title & Icon */}
                        <div className="card-header">
                            <span className={`card-label ${stat.textVariant || ''}`}>
                                {stat.label}
                            </span>
                            {Icon && (
                                <Icon className={`card-icon ${stat.iconVariant || ''}`} />
                            )}
                        </div>

                        {/* Main Value & Subtext */}
                        <div className="card-body">
                            <h2 className={`card-amount ${stat.textVariant || ''}`}>
                                {stat.value}
                            </h2>

                            {stat.subtext && (
                                <p
                                    className={`card-subtext ${stat.subtextBold ? 'bold-subtext' : ''
                                        } ${stat.subtextLarge ? 'large-subtext' : ''}`}
                                >
                                    {stat.subtext}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;