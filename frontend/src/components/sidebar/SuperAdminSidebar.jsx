import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaThLarge,
    FaUsers,
    FaGasPump,
    FaCog,
    FaSignOutAlt,
    FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './SuperAdminSidebar.css';
import logo from '../../assests/sidebar-pump-logo/pump-logo.png';

const SuperAdminSidebar = ({ closeSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo-icon">
                    <img src={logo} alt="CNG Hub Logo" className="logo-img" />
                </div>
                <div className="brand-text">
                    <span className="brand-title">CNG Hub</span>
                    <span className="brand-subtitle">Super Admin</span>
                </div>
                <button
                    className="sidebar-close-btn"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                    type="button"
                >
                    <FaTimes size={18} />
                </button>
            </div>

            <nav className="sidebar-menu">
                <NavLink
                    to="/super-admin/dashboard"
                    onClick={handleLinkClick}
                    className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FaThLarge size={18} className="menu-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/super-admin/admins"
                    onClick={handleLinkClick}
                    className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FaUsers size={18} className="menu-icon" />
                    <span>Admins</span>
                </NavLink>

                <NavLink
                    to="/super-admin/pumps"
                    onClick={handleLinkClick}
                    className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FaGasPump size={18} className="menu-icon" />
                    <span>CNG Pumps</span>
                </NavLink>

                <NavLink
                    to="/super-admin/settings"
                    onClick={handleLinkClick}
                    className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FaCog size={18} className="menu-icon" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn" type="button">
                    <FaSignOutAlt size={18} className="menu-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;