import React, { useState } from 'react';
import { FaUser, FaCheck } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
    // Profile State
    const [profile, setProfile] = useState({
        fullName: 'Super Admin User',
        email: 'admin@cngcontrol.com',
        phone: '+1 (555) 019-2837',
    });

    // Password State
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // System Preferences State
    const [preferences, setPreferences] = useState({
        dateFormat: 'DD/MM/YYYY',
        timezone: 'UTC (Coordinated Universal Time)',
        language: 'English (Default)',
    });

    // Toggle Switches State
    const [toggles, setToggles] = useState({
        twoFactor: true,
        systemAlerts: true,
        newAdminRegistrations: true,
        pumpStatusChanges: false,
        securityAlerts: true,
    });

    const handleToggle = (key) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="settings-page">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">
                    Manage your account preferences and global system configurations.
                </p>
            </div>

            {/* Main Settings Grid */}
            <div className="settings-grid">
                {/* Left Column */}
                <div className="settings-col">
                    {/* Profile Settings Card */}
                    <div className="settings-card">
                        <h2 className="card-title">Profile Settings</h2>
                        <div className="card-divider" />

                        <div className="profile-section">
                            <div className="avatar-wrapper">
                                <div className="avatar-placeholder">
                                    <FaUser size={28} />
                                </div>
                                <button type="button" className="change-picture-btn">
                                    Change Picture
                                </button>
                            </div>

                            <div className="profile-fields">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>FULL NAME</label>
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) =>
                                                setProfile({ ...profile, fullName: e.target.value })
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>EMAIL ADDRESS</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) =>
                                                setProfile({ ...profile, email: e.target.value })
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>PHONE NUMBER</label>
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            setProfile({ ...profile, phone: e.target.value })
                                        }
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer-actions">
                            <button type="button" className="primary-save-btn">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="settings-card">
                        <h2 className="card-title">Security</h2>
                        <div className="card-divider" />

                        <div className="security-section">
                            <h3 className="sub-heading">Change Password</h3>
                            <div className="password-fields-grid">
                                <div className="form-group">
                                    <label>CURRENT PASSWORD</label>
                                    <input
                                        type="password"
                                        value={password.currentPassword}
                                        onChange={(e) =>
                                            setPassword({ ...password, currentPassword: e.target.value })
                                        }
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>NEW PASSWORD</label>
                                    <input
                                        type="password"
                                        value={password.newPassword}
                                        onChange={(e) =>
                                            setPassword({ ...password, newPassword: e.target.value })
                                        }
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CONFIRM PASSWORD</label>
                                    <input
                                        type="password"
                                        value={password.confirmPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="password-btn-wrapper">
                                <button type="button" className="secondary-action-btn">
                                    Update Password
                                </button>
                            </div>

                            <div className="inner-divider" />

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-title">Two-Factor Authentication (2FA)</span>
                                    <span className="toggle-desc">
                                        Add an extra layer of security to your account.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`custom-toggle ${toggles.twoFactor ? 'checked' : ''}`}
                                    onClick={() => handleToggle('twoFactor')}
                                >
                                    <span className="toggle-handle">
                                        {toggles.twoFactor && <FaCheck size={9} />}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="settings-col">
                    {/* System Preferences Card */}
                    <div className="settings-card">
                        <h2 className="card-title">System Preferences</h2>
                        <div className="card-divider" />

                        <div className="preferences-form">
                            <div className="form-group">
                                <label>GLOBAL DATE FORMAT</label>
                                <select
                                    value={preferences.dateFormat}
                                    onChange={(e) =>
                                        setPreferences({ ...preferences, dateFormat: e.target.value })
                                    }
                                    className="form-select"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>TIMEZONE</label>
                                <select
                                    value={preferences.timezone}
                                    onChange={(e) =>
                                        setPreferences({ ...preferences, timezone: e.target.value })
                                    }
                                    className="form-select"
                                >
                                    <option value="UTC (Coordinated Universal Time)">
                                        UTC (Coordinated Universal Time)
                                    </option>
                                    <option value="PKT (Pakistan Standard Time)">
                                        PKT (Pakistan Standard Time)
                                    </option>
                                    <option value="EST (Eastern Standard Time)">
                                        EST (Eastern Standard Time)
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>LANGUAGE</label>
                                <select
                                    value={preferences.language}
                                    onChange={(e) =>
                                        setPreferences({ ...preferences, language: e.target.value })
                                    }
                                    className="form-select"
                                >
                                    <option value="English (Default)">English (Default)</option>
                                    <option value="Urdu">Urdu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings Card */}
                    <div className="settings-card">
                        <h2 className="card-title">Notification Settings</h2>
                        <div className="card-divider" />

                        <div className="notifications-list">
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-title">System Alerts</span>
                                    <span className="toggle-desc">
                                        Critical system maintenance and updates.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`custom-toggle ${toggles.systemAlerts ? 'checked' : ''}`}
                                    onClick={() => handleToggle('systemAlerts')}
                                >
                                    <span className="toggle-handle">
                                        {toggles.systemAlerts && <FaCheck size={9} />}
                                    </span>
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-title">New Admin Registrations</span>
                                    <span className="toggle-desc">
                                        Alerts when a new admin account is created.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`custom-toggle ${toggles.newAdminRegistrations ? 'checked' : ''
                                        }`}
                                    onClick={() => handleToggle('newAdminRegistrations')}
                                >
                                    <span className="toggle-handle">
                                        {toggles.newAdminRegistrations && <FaCheck size={9} />}
                                    </span>
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-title">Pump Status Changes</span>
                                    <span className="toggle-desc">
                                        Notifications for offline or fault states.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`custom-toggle ${toggles.pumpStatusChanges ? 'checked' : ''
                                        }`}
                                    onClick={() => handleToggle('pumpStatusChanges')}
                                >
                                    <span className="toggle-handle">
                                        {toggles.pumpStatusChanges && <FaCheck size={9} />}
                                    </span>
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-title">Security Alerts</span>
                                    <span className="toggle-desc">
                                        Failed logins and suspicious activity.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`custom-toggle ${toggles.securityAlerts ? 'checked' : ''
                                        }`}
                                    onClick={() => handleToggle('securityAlerts')}
                                >
                                    <span className="toggle-handle">
                                        {toggles.securityAlerts && <FaCheck size={9} />}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;