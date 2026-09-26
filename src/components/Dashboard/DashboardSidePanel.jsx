import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaEnvelope, FaHistory } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api, { resolveAssetUrl } from "../../utils/api";
import "./DashboardSidePanel.css";

export default function DashboardSidePanel({ onReady }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    let active = true;

    api.get("/notifications/me")
      .then((data) => active && setNotifications(Array.isArray(data) ? data : []))
      .catch(() => active && setNotifications([]))
      .finally(() => active && onReady?.());

    return () => {
      active = false;
    };
  }, [onReady]);

  const openProfile = () => navigate("/complete-profile");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-side">
      <div className="side-profile-card">
        <div
          className="side-profile-summary"
          role="link"
          tabIndex={0}
          title="Open profile"
          onClick={openProfile}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openProfile();
            }
          }}
        >
          <div className="side-profile-info">
            <p className="side-profile-eyebrow">Account Overview</p>
            <h3>{user?.name || "Guest User"}</h3>
            <p className="side-user-id"><span>Member ID</span><strong>{user?.userId || user?.id || "Not available"}</strong></p>
            <div className="side-profile-contact">
              <p><span>Email</span><strong>{user?.email || "Not provided"}</strong></p>
              <p><span>Mobile</span><strong>{user?.mobile || user?.contact || "Not provided"}</strong></p>
            </div>
          </div>
        </div>

        <div className="side-profile-status-row">
          {!user?.profileCompleted && (
            <button className="side-profile-note" type="button" onClick={() => navigate("/complete-profile")}>
              Complete your profile to personalise your travel planning.
            </button>
          )}

          <button className="side-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="side-card clickable" onClick={() => navigate("/recently-viewed-packages")}><FaHistory /> Recently Viewed Packages</div>
      <div className="side-card clickable" onClick={() => navigate("/payments")}><FaCreditCard /> Payments</div>
      <div className="side-card"><FaEnvelope /> Enquiry</div>

      <div className="side-card notification-card">
        <div className="notification-header" onClick={() => setShowNotif(!showNotif)} style={{ cursor: "pointer" }}>
          Notifications <span className="notification-count"> {notifications.length}</span>
        </div>
        {showNotif && (
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notification">No Notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="notification-item" onClick={() => setSelectedNotif(n)}>
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-msg">{n.message || n.description}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedNotif && (
        <div className="notif-popup-overlay" onClick={() => setSelectedNotif(null)}>
          <div className="notif-popup" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedNotif.title}</h2>
            <p>{selectedNotif.message || selectedNotif.description}</p>
            {selectedNotif.image && <img src={resolveAssetUrl(selectedNotif.image)} alt="" className="notif-popup-img" />}
            {selectedNotif.pdf && (
              <a href={resolveAssetUrl(selectedNotif.pdf)} target="_blank" rel="noopener noreferrer" className="notif-download-btn">Download PDF</a>
            )}
            <button className="notif-close-btn" onClick={() => setSelectedNotif(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
