import { useEffect, useState } from "react";
import { User, Briefcase, ShieldAlert } from "lucide-react";
import { getAdminProfile } from "../../../services/adminApis/profile";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const response = await getAdminProfile();

      console.log("Admin Profile API Response:", response);

      const profileData = response?.data || response?.profile || response;

      setProfile(profileData);
    } catch (error) {
      console.error("Admin Profile Error:", error?.response?.data || error);

      alert(
        error?.response?.data?.message ||
          "Unable to load profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      fetchProfile();
    };
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Top Hero Banner Card */}
      <div className="profile-hero-card">
        <div className="hero-details">
          <h2 className="hero-name">
            {profile.fullName || profile.name || "N/A"}
          </h2>

          <p className="hero-role">
            {profile.role || profile.systemRole || "Admin"}
          </p>
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
              <p>{profile.fullName || profile.name || "N/A"}</p>
            </div>

            <div className="info-group">
              <label>Email Address</label>
              <p>{profile.email || "N/A"}</p>
            </div>

            <div className="info-group">
              <label>Address</label>
              <p>{profile.address || "N/A"}</p>
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
              <p>{profile.assignedStation || "N/A"}</p>
            </div>

            <div className="info-group">
              <label>System Role</label>

              <div className="role-pill">
                <ShieldAlert size={14} />

                <span>{profile.role || profile.systemRole || "Admin"}</span>
              </div>
            </div>

            <div className="info-group">
              <label>Joining Date</label>
              <p>{profile.joiningDate || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
