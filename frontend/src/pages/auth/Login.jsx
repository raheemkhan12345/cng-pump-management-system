import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;

        const user = login(email, password);
        if (user.role === 'SUPER_ADMIN') {
            navigate('/super-admin/dashboard');
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                {/* Brand Logo */}
                <div className="login-logo">
                    <div className="logo-icon-wrap">
                        <span className="logo-text-top">CNG HUB</span>
                        <span className="logo-text-bottom">CNG Hub</span>
                    </div>
                </div>

                <h2 className="login-title">Station Admin Login</h2>
                <p className="login-subtitle">
                    Enter your credentials to access your dashboard
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-container">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. admin_alpha"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-container">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-checkbox">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember Me</span>
                        </label>
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>
                </form>

                <p className="help-text">
                    Need help accessing your account? <a href="#support">Contact Support</a>
                </p>
            </div>

            <footer className="login-footer">
                <div>© 2026 Industrial Integrity Systems. All rights reserved.</div>
                <div className="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#support">Support</a>
                    <a href="#terms">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default Login;