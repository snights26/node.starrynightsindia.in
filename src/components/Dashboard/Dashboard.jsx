import { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import MyBucketList from "./MyBucketList";
import MyTours from "./MyTours";
import DashboardSidePanel from "./DashboardSidePanel";

class DashboardErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Dashboard could not be displayed", error);
  }

  render() {
    if (this.state.hasError) {
      return <DashboardRecovery />;
    }

    return this.props.children;
  }
}

function DashboardRecovery() {
  const navigate = useNavigate();

  return (
    <main className="dashboard-recovery" role="alert">
      <p className="dashboard-recovery__eyebrow">Dashboard unavailable</p>
      <h1>We could not load your travel dashboard.</h1>
      <p>Please refresh the page. Your account and saved packages are safe.</p>
      <div className="dashboard-recovery__actions">
        <button type="button" onClick={() => window.location.reload()}>Refresh dashboard</button>
        <button type="button" className="dashboard-recovery__secondary" onClick={() => navigate("/")}>Back to home</button>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <DashboardErrorBoundary>
      <div className="dashboard-container">
        <div className="dashboard-main">
          <MyBucketList />
          <MyTours />
        </div>

        <DashboardSidePanel />
      </div>
    </DashboardErrorBoundary>
  );
}
