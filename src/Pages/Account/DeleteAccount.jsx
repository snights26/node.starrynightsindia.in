import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoginPopup from "../../components/AuthFolder/Login";
import "./DeleteAccount.css";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const deleted = searchParams.get("deleted") === "1";

  const deleteAccount = async () => {
    if (confirmation !== "DELETE" || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await api.delete("/account", { data: { confirmation: "DELETE" } });
      logout();
      navigate("/delete-account?deleted=1", { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "We could not delete your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (deleted) {
    return (
      <main className="delete-account-page">
        <section className="delete-account-card" aria-labelledby="delete-account-title">
          <p className="delete-account-eyebrow">Starry Nights</p>
          <h1 id="delete-account-title">Your account has been deleted.</h1>
          <p>Your account and associated account data have been removed. You are now signed out.</p>
          <button type="button" className="delete-account-secondary" onClick={() => navigate("/")}>Back to home</button>
        </section>
      </main>
    );
  }

  if (loading) {
    return <main className="delete-account-page"><section className="delete-account-card" aria-live="polite">Checking your account…</section></main>;
  }

  if (!user) {
    return (
      <main className="delete-account-page">
        <section className="delete-account-card" aria-labelledby="delete-account-title">
          <p className="delete-account-eyebrow">Starry Nights</p>
          <h1 id="delete-account-title">Delete Account</h1>
          <p>To protect your account, sign in before requesting deletion. This page works even if you have uninstalled the app.</p>
          <button type="button" className="delete-account-primary" onClick={() => setShowLogin(true)}>Sign in to delete your Starry Nights account</button>
        </section>
        {showLogin ? <LoginPopup onClose={() => setShowLogin(false)} redirectTo="/delete-account" /> : null}
      </main>
    );
  }

  return (
    <main className="delete-account-page">
      <section className="delete-account-card" aria-labelledby="delete-account-title">
        <p className="delete-account-eyebrow">Starry Nights</p>
        <h1 id="delete-account-title">Delete My Account</h1>
        <p>This permanently deletes your account and associated account data. This action cannot be undone.</p>
        <p className="delete-account-retention">Booking and payment records that must be retained for operational, legal, or security reasons are anonymized and no longer linked to your account.</p>
        <label htmlFor="delete-account-confirmation">Type <strong>DELETE</strong> to confirm</label>
        <input
          id="delete-account-confirmation"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-describedby={error ? "delete-account-error" : undefined}
        />
        {error ? <p id="delete-account-error" className="delete-account-error" role="alert">{error}</p> : null}
        <div className="delete-account-actions">
          <button type="button" className="delete-account-secondary" onClick={() => navigate("/dashboard")} disabled={submitting}>Cancel</button>
          <button type="button" className="delete-account-danger" onClick={deleteAccount} disabled={confirmation !== "DELETE" || submitting}>
            {submitting ? "Deleting account…" : "Delete My Account"}
          </button>
        </div>
      </section>
    </main>
  );
}
