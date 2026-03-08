import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function UploadReel() {
  const nav = useNavigate();

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setPreviewError(false);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewError(false);
    setUploadedVideoUrl("");

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFileChange = (e) => {
    const selected = e.target.files?.[0];
    setErr("");
    setUploadedVideoUrl("");
    setPreviewError(false);
    setFile(selected || null);
  };

  const onUpload = async (e) => {
    e.preventDefault();
    setErr("");

    if (!file) {
      setErr("Pehle video select karo.");
      return;
    }

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("video", file);
      fd.append("caption", caption);

      const { data } = await api.post("/api/reels/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const finalUrl = data?.data?.videoUrl;
if (finalUrl) {
  const abs = finalUrl.startsWith("http")
    ? finalUrl
    : `http://localhost:3000${finalUrl}`;
  setUploadedVideoUrl(abs);
}

setTimeout(() => {
  nav("/reels", { replace: true });
}, 1200);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pagePad" style={{ paddingBottom: 96 }}>
      <div className="card" style={styles.card}>
        <div style={styles.brandRow}>
          <img src="/MangoX.png" alt="MangoX" style={styles.logo} />
          <div>
            <div style={styles.title}>Upload Reel</div>
            <div className="muted">Browser se direct reel upload karo</div>
          </div>
        </div>

        {err ? <div style={styles.err}>{err}</div> : null}

        <form onSubmit={onUpload} style={styles.form}>
          <label style={styles.label}>Select video</label>
          <input type="file" accept="video/*" onChange={onFileChange} />

          <label style={styles.label}>Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            style={styles.textarea}
          />

          <div style={styles.previewBlock}>
            <div style={styles.label}>Preview</div>

            {!file ? (
              <div style={styles.emptyBox}>Koi video select nahi hai</div>
            ) : uploadedVideoUrl ? (
              <div>
                <div style={styles.success}>Upload ke baad converted preview</div>
                <div style={styles.videoWrap}>
                  <video
                    src={uploadedVideoUrl}
                    controls
                    playsInline
                    style={styles.video}
                  />
                </div>
              </div>
            ) : previewError ? (
              <div style={styles.unsupportedBox}>
                <div style={styles.unsupportedTitle}>Local preview supported nahi hai</div>
                <div className="muted">
                  Ye normal hai. File ka codec browser-friendly nahi hai. Upload ke baad
                  converted reel preview yahin dikhega.
                </div>
              </div>
            ) : (
              <div style={styles.videoWrap}>
                <video
                  ref={videoRef}
                  src={previewUrl}
                  controls
                  playsInline
                  preload="metadata"
                  style={styles.video}
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
          </div>

          <button type="submit" style={styles.btn} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Reel"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 720,
    margin: "0 auto",
    padding: 22,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    objectFit: "cover",
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--text)",
  },
  form: {
    display: "grid",
    gap: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--text)",
  },
  textarea: {
    minHeight: 120,
    resize: "vertical",
    borderRadius: 16,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    color: "var(--text)",
    padding: 14,
    outline: "none",
  },
  previewBlock: {
    display: "grid",
    gap: 10,
  },
  videoWrap: {
    width: "100%",
    background: "#000",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid var(--line)",
  },
  video: {
    width: "100%",
    maxHeight: "70vh",
    display: "block",
    background: "#000",
  },
  unsupportedBox: {
    borderRadius: 18,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    padding: 18,
  },
  unsupportedTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "var(--text)",
    marginBottom: 6,
  },
  emptyBox: {
    borderRadius: 18,
    border: "1px dashed var(--line)",
    background: "var(--bg-soft)",
    padding: 22,
    color: "var(--muted)",
    textAlign: "center",
  },
  btn: {
    marginTop: 8,
    border: 0,
    borderRadius: 16,
    padding: "14px 18px",
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(135deg, #ff7a18, #ff2d55 55%, #8a3ffc)",
  },
  err: {
    marginBottom: 16,
    border: "1px solid rgba(255, 59, 48, 0.22)",
    background: "rgba(255, 59, 48, 0.1)",
    color: "#ff6b6b",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
  },
  success: {
    color: "#4ade80",
    fontWeight: 700,
    marginBottom: 8,
  },
};