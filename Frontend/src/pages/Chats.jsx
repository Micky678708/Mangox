import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getChatsApi } from "../api/chatApi";
import ChatLayout from "../components/chat/ChatLayout";
export default function Chats() {
  return <ChatLayout/>;}
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const list = await getChatsApi();
        setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Chats load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (u) =>
        u?.name?.toLowerCase().includes(q) ||
        u?.username?.toLowerCase().includes(q) ||
        u?.lastMessage?.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="pagePad" style={{ paddingBottom: 90 }}>
      <div className="card" style={styles.wrap}>
        <div style={styles.head}>
          <div>
            <div className="h1">Chats</div>
            <div className="muted">Smooth and modern messaging</div>
          </div>
          <div style={styles.onlinePill}>Online</div>
        </div>

        <div style={styles.searchWrap}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats..."
            style={styles.search}
          />
        </div>

        {loading ? <div className="muted">Loading chats...</div> : null}
        {err ? <div style={styles.err}>{err}</div> : null}

        <div style={styles.list}>
          {filtered.map((u) => (
            <Link key={u.id} to={`/chat/${u.id}`} style={styles.row}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar} />
                {u.online ? <span style={styles.onlineDot} /> : null}
              </div>

              <div style={styles.body}>
                <div style={styles.rowTop}>
                  <div style={styles.name}>{u.name}</div>
                  <div style={styles.time}>
                    {formatTime(u.updatedAt)}
                  </div>
                </div>

                <div style={styles.rowBottom}>
                  <div style={styles.last}>{u.lastMessage}</div>
                  {u.unread ? <div style={styles.badge}>{u.unread}</div> : null}
                </div>
              </div>
            </Link>
          ))}

          {!loading && !filtered.length ? (
            <div className="muted" style={{ textAlign: "center", padding: 18 }}>
              No chats found
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );


function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: 16,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  onlinePill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "var(--bg-soft)",
    border: "1px solid var(--line)",
    color: "var(--text)",
    fontSize: 13,
    fontWeight: 700,
  },
  searchWrap: {
    marginBottom: 14,
  },
  search: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 16,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    color: "var(--text)",
    outline: "none",
  },
  list: {
    display: "grid",
    gap: 8,
  },
  row: {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  borderRadius: 18,
  textDecoration: "none",
  color: "inherit",
  background: "transparent",
  border: "1px solid transparent",
  transition: "0.2s ease",
  overflow: "hidden",
},
  avatarWrap: {
    position: "relative",
    width: 54,
    height: 54,
    flex: "0 0 auto",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)",
  },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#4ade80",
    border: "2px solid var(--card)",
  },
  body: {
    minWidth: 0,
    flex: 1,
    overflow: "hidden",
  },
  rowTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontWeight: 800,
    color: "var(--text)",
  },
  time: {
    color: "var(--muted)",
    fontSize: 12,
  },
  rowBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    minWidth: 0,
  },
  last: {
    color: "var(--muted)",
    fontSize: 14,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
    flex: 1,
    maxWidth: 100,

  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    padding: "0 6px",
    background: "#7c5cff",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
  },
  err: {
    marginBottom: 10,
    borderRadius: 14,
    padding: "10px 12px",
    color: "#ff6b6b",
    background: "rgba(255,59,48,0.10)",
    border: "1px solid rgba(255,59,48,0.18)",
  },
};