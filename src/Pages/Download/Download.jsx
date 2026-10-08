import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./Download.css";

const formatFileSize = (value) => {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return "Not available";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function Download() {
  const [release, setRelease] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/app-releases/android/current")
      .then((data) => {
        if (!active) return;
        setRelease(data ?? null);
        setLoaded(true);
      })
      .catch((requestError) => {
        if (!active) return;
        setLoaded(true);
        if (requestError?.response?.status === 404) {
          setError("The Android download will be available here shortly.");
          return;
        }
        setError("We could not load the current Android release. Please try again shortly.");
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="android-download-page">
      <section className="android-download-card" aria-labelledby="android-download-title">
        <p className="android-download-eyebrow">Starry Nights</p>
        <h1 id="android-download-title">Starry Nights for Android</h1>
        <p className="android-download-intro">Download the current Android APK directly from Starry Nights.</p>
        {error ? <p className="android-download-message" role="status">{error}</p> : null}
        {!loaded && !error ? <p className="android-download-message" aria-live="polite">Loading the current Android release…</p> : null}
        {loaded && !release && !error ? <p className="android-download-message" role="status">The Android download will be available here shortly.</p> : null}
        {release ? (
          <>
            <dl className="android-release-details">
              <div><dt>Current Version</dt><dd>{release.versionName}</dd></div>
              <div><dt>Version Code</dt><dd>{release.versionCode}</dd></div>
              <div><dt>File Size</dt><dd>{formatFileSize(release.fileSize)}</dd></div>
              {release.releaseNotes ? <div className="android-release-notes"><dt>Release Notes</dt><dd>{release.releaseNotes}</dd></div> : null}
            </dl>
            <a className="android-download-button" href={release.downloadUrl} target="_blank" rel="noreferrer" download={release.fileName}>
              Download APK
            </a>
            <p className="android-download-note">After downloading, Android may ask you to allow installation from your browser or Files app.</p>
          </>
        ) : null}
      </section>
    </main>
  );
}
