import React, { useEffect, useState } from "react";
import { getHomeFeedApi } from "../api/homeApi";
import ReelCard from "../components/ReelCard";
import StoryRow from "../components/StoryRow";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const list = await getHomeFeedApi();
        setReels(Array.isArray(list) ? list : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Feed error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div className="pagePad">
          <div className="card" style={{ textAlign: "center" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={styles.page}>
        <div className="pagePad">
          <div className="card" style={{ textAlign: "center" }}>
            {err}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.feedWrap}>
        <div style={styles.topBar}>
          <img src="/MangoX.png" alt="MangoX" style={styles.logo} />
          <div style={styles.brand}>MangoX</div>
        </div>

        <StoryRow />

        <div style={styles.feedList}>
          {reels.length ? (
            reels.map((r) => <ReelCard key={r._id} reel={r} variant="home" />)
          ) : (
            <div className="pagePad">
              <div className="card" style={{ textAlign: "center" }}>
                No reels yet
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    paddingBottom: 86,
  },
  feedWrap: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
  },
  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 14px",
    background: "var(--bg)",
    borderBottom: "1px solid var(--line)",
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    objectFit: "cover",
  },
  brand: {
    color: "var(--text)",
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  feedList: {
    paddingTop: 8,
  },
};