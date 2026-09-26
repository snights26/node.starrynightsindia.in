import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../../common";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="private-route-loading" aria-live="polite">
        <Loader label="Opening your dashboard…" />
      </main>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}
