import React from "react";
import {
  Pencil,
  Clock,
  ShieldCheck,
  User,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      {/* Top Hero Banner Card */}
      <div className="profile-hero-card">
        <div className="avatar-wrapper">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
            alt="Muhammad Bilal"
            className="profile-avatar"
          />
          <button className="avatar-edit-btn" title="Edit Avatar" type="button">
            <Pencil size={13} />
          </button>
        </div>

        <div className="hero-details">
          <h2 className="hero-name">Muhammad Bilal</h2>
          <p className="hero-role">Super Admin</p>

          <div className="hero-badges">
            <div className="badge badge-gray">
              <Clock size={14} />
              <span>Last Login: Today, 08:30 AM</span>
            </div>
            <div className="badge badge-green">
              <ShieldCheck size={14} />
              <span>Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Cards Grid */}
      <div className="details-grid">
        {/* Personal Details Card */}
        <div className="details-card">
          <div className="card-header">
            <div className="card-icon-box">
              <User size={18} />
            </div>
            <h3>Personal Details</h3>
          </div>

          <div className="card-body">
            <div className="info-group">
              <label>Full Name</label>
              <p>Muhammad Bilal</p>
            </div>

            <div className="info-group">
              <label>Email Address</label>
              <p>bilal.admin@cngpk.com</p>
            </div>

            <div className="info-group">
              <label>Address</label>
              <p>Mingora, Swat, Khyber Pakhtunkhwa, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Professional Details Card */}
        <div className="details-card">
          <div className="card-header">
            <div className="card-icon-box">
              <Briefcase size={18} />
            </div>
            <h3>Professional Details</h3>
          </div>

          <div className="card-body">
            <div className="info-group">
              <label>Assigned Station</label>
              <p>CNG Pump 01 - Main Highway Branch</p>
            </div>

            <div className="info-group">
              <label>System Role</label>
              <div className="role-pill">
                <ShieldAlert size={14} />
                <span>Admin</span>
              </div>
            </div>

            <div className="info-group">
              <label>Joining Date</label>
              <p>January 12, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
