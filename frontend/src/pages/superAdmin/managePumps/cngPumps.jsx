import React, { useState } from 'react';
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrashAlt,
    FaUserPlus
} from 'react-icons/fa';
import AddPumpModal from '../../../components/addNewPumpForm/AddPumpForm';
import './CngPumps.css';

const CngPumps = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Pumps Data matching the provided design
    const [pumps, setPumps] = useState([
        {
            id: 1,
            pumpNo: 'P-9923',
            name: 'Station Alpha-01',
            location: 'Downtown Hub',
            status: 'Active',
            admin: {
                name: 'John Doe',
                initials: 'JD',
                assigned: true
            },
            dateCommissioned: 'Oct 12, 2023',
        },
        {
            id: 2,
            pumpNo: 'P-8812',
            name: 'Station Beta-04',
            location: 'Northside Industrial',
            status: 'Active',
            admin: {
                name: '',
                initials: '',
                assigned: false
            },
            dateCommissioned: 'Nov 05, 2023',
        },
        {
            id: 3,
            pumpNo: 'P-4451',
            name: 'Station Gamma-02',
            location: 'West Valley',
            status: 'Inactive',
            admin: {
                name: 'Alice Smith',
                initials: 'AS',
                assigned: true
            },
            dateCommissioned: 'Jan 22, 2022',
        },
    ]);

    const handleAddPump = (newPumpData) => {
        const newEntry = {
            id: pumps.length + 1,
            pumpNo: `P-${Math.floor(1000 + Math.random() * 9000)}`,
            name: newPumpData.pumpName,
            location: newPumpData.pumpAddress,
            status: 'Active',
            admin: {
                name: newPumpData.adminName,
                initials: newPumpData.adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                assigned: true
            },
            dateCommissioned: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };
        setPumps([newEntry, ...pumps]);
    };

    const filteredPumps = pumps.filter(
        (pump) =>
            pump.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pump.pumpNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pump.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pump.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pump.admin.assigned && pump.admin.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="pumps-page">
            {/* Page Header */}
            <div className="page-header-container">
                <div className="page-header">
                    <h1 className="page-title">CNG Pumps</h1>
                    <p className="page-subtitle">
                        Configure and manage pump infrastructure across locations.
                    </p>
                </div>
                <button className="add-pump-btn" onClick={() => setIsModalOpen(true)}>
                    <FaPlus size={13} />
                    <span>Add CNG Pump</span>
                </button>
            </div>

            {/* Main Table Card */}
            <div className="pumps-card">
                {/* Top Control Bar */}
                <div className="table-controls">
                    <h3 className="section-title">Active Infrastructure</h3>

                    <div className="controls-right">
                        <button className="icon-filter-btn" title="Filter">
                            <FaFilter size={13} />
                        </button>
                        <div className="search-input-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search pumps..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-responsive">
                    <table className="pumps-table">
                        <thead>
                            <tr>
                                <th>PUMP NAME / NO</th>
                                <th>LOCATION</th>
                                <th>STATUS</th>
                                <th>ASSIGNED ADMIN</th>
                                <th>DATE COMMISSIONED</th>
                                <th className="text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPumps.length > 0 ? (
                                filteredPumps.map((pump) => (
                                    <tr key={pump.id}>
                                        <td>
                                            <div className="pump-info-cell">
                                                <span className={`pump-title ${pump.status === 'Inactive' ? 'text-disabled' : ''}`}>
                                                    {pump.name}
                                                </span>
                                                <span className="pump-id">ID: {pump.pumpNo}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="location-text">{pump.location}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${pump.status.toLowerCase()}`}>
                                                • {pump.status}
                                            </span>
                                        </td>
                                        <td>
                                            {pump.admin.assigned ? (
                                                <div className="admin-profile-cell">
                                                    <div className="admin-initials">{pump.admin.initials}</div>
                                                    <span className="admin-name">{pump.admin.name}</span>
                                                </div>
                                            ) : (
                                                <button className="assign-admin-btn">
                                                    <FaUserPlus size={12} />
                                                    <span>Assign Admin</span>
                                                </button>
                                            )}
                                        </td>
                                        <td className="table-text-muted">{pump.dateCommissioned}</td>
                                        <td>
                                            <div className="action-icons">
                                                <button className="action-btn edit-btn" title="Edit Pump">
                                                    <FaEdit size={14} />
                                                </button>
                                                <button className="action-btn delete-btn" title="Delete Pump">
                                                    <FaTrashAlt size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No CNG pumps found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="table-footer">
                    <span className="entries-count">Showing {filteredPumps.length} of {pumps.length} pumps</span>
                    <div className="pagination-wrapper">
                        <button className="page-nav-btn">Prev</button>
                        <button className="page-num-btn active">1</button>
                        <button className="page-nav-btn">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Pump Modal Integration */}
            <AddPumpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddPump={handleAddPump}
            />
        </div>
    );
};

export default CngPumps;