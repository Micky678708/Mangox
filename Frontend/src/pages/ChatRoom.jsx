import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getChatMessagesApi,
  sendMessageApi,
  sendMediaMessageApi,
} from "../api/chatApi";

export default function ChatRoom() {
  const { id } = useParams();

  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
const [showPlus, setShowPlus] = useState(false);
const [showMenu, setShowMenu] = useState(false);
const [isTyping, setIsTyping] = useState(false)
const typingTimeout = useRef(null)
const [showThemePicker, setShowThemePicker] = useState(false);
const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
const [activeReaction, setActiveReaction] = useState(null);


const [chatTheme, setChatTheme] = useState(
  () => localStorage.getItem(`chat-theme-${id}`) || "insta"
);

const [chatWallpaper, setChatWallpaper] = useState(
  () => localStorage.getItem(`chat-wallpaper-${id}`) || "softDark"
);

const sendSound = useRef(new Audio("/sounds/send.mp3"));
const receiveSound = useRef(new Audio("/sounds/receive.mp3"));

  const fileRef = useRef(null);
  const endRef = useRef(null);

  const toAbs = (url = "") => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await getChatMessagesApi(id);
        setChat(data?.chat || null);
        setMsgs(
          Array.isArray(data?.messages)
            ? data.messages.map((m) => ({
                ...m,
                url: m?.url ? toAbs(m.url) : "",
              }))
            : []
        );
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Chat load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
  localStorage.setItem(`chat-theme-${id}`, chatTheme);
}, [id, chatTheme]);

useEffect(() => {
  localStorage.setItem(`chat-wallpaper-${id}`, chatWallpaper);
}, [id, chatWallpaper]);

useEffect(() => {
  setChatTheme(localStorage.getItem(`chat-theme-${id}`) || "insta");
  setChatWallpaper(localStorage.getItem(`chat-wallpaper-${id}`) || "softDark");
}, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const title = useMemo(() => {
    return chat?.name || `user${id}`;
  }, [chat, id]);

  const onSend = async () => {

    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const temp = {
      id: Date.now(),
      sender: "me",
      text: trimmed,
      createdAt: Date.now(),
      recation:"",
      status:"send"
    }
    setMsgs((prev) => [...prev, temp]);
    setText("");
    //demo seen systen
    setTimeout(()=>{
      setMsgs(prev =>
        prev.map(m =>
          m.id === temp.id
          ? {...m,status:"seen"}
          : m
        ))},2000)
        {}

    try {
      const saved = await sendMessageApi(id, { text: trimmed });
      setMsgs((prev) => prev.map((m) => (m.id === temp.id ? saved : m)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Message failed");
      setMsgs((prev) => prev.filter((m) => m.id !== temp.id));
    } finally {
      setSending(false);
    }
  };

  const handleMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = `temp-${Date.now()}`;
    const isVideo = file.type.startsWith("video/");

    const temp = {
      id: tempId,
      sender: "me",
      type: isVideo ? "video" : "image",
      text: "",
      url: URL.createObjectURL(file),
      createdAt: Date.now(),
    };

    setMsgs((prev) => [...prev, temp]);

    try {
      const saved = await sendMediaMessageApi(id, file);

      const normalized = {
        ...saved,
        url: toAbs(saved?.url || ""),
      };

      setMsgs((prev) => prev.map((m) => (m.id === tempId ? normalized : m)));
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Media send failed");
      setMsgs((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      e.target.value = "";
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const toggleReaction = (msgId, emoji) => {
  setMsgs(prev =>
    prev.map(m =>
      m.id === msgId
        ? { ...m, reaction: m.reaction === emoji ? "" : emoji }
        : m
    )
  );
};

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.top}>
          <div style={styles.topLeft}>
            <Link to="/chats" style={styles.backBtn}>
              ←
            </Link>

            <div style={styles.avatar} />

            <div>
              <div style={styles.name}>{title}</div>
              <div style={styles.sub}>{chat?.online ? "online" : "secure chat"}</div>
            </div>
          </div>

          <div style={styles.topRight}>
            <button style={styles.iconBtn}>📞</button>
            <button style={styles.iconBtn}>🎥</button>
            <button
 style={styles.iconBtn}
 onClick={() => setShowMenu(!showMenu)}
>
 ⋮
</button>

{showThemePicker && (
  <div style={styles.pickerCard}>
    <div style={styles.pickerTitle}>Choose chat theme</div>

    <div style={styles.themeGrid}>
      {Object.keys(CHAT_THEMES).map((key) => (
        <button
          key={key}
          style={{
            ...styles.themeChip,
            border:
              chatTheme === key
                ? `2px solid ${CHAT_THEMES[key].accent}`
                : "1px solid var(--line)",
          }}
          onClick={() => setChatTheme(key)}
        >
          <span
            style={{
              ...styles.themePreview,
              background: CHAT_THEMES[key].meBubble,
            }}
          />
          {key}
        </button>
      ))}
    </div>
  </div>
)}

{showWallpaperPicker && (
  <div style={styles.pickerCard}>
    <div style={styles.pickerTitle}>Choose wallpaper</div>

    <div style={styles.themeGrid}>
      {Object.keys(CHAT_WALLPAPERS).map((key) => (
        <button
          key={key}
          style={{
            ...styles.themeChip,
            border:
              chatWallpaper === key
                ? "2px solid #7c5cff"
                : "1px solid var(--line)",
          }}
          onClick={() => setChatWallpaper(key)}
        >
          <span
            style={{
              ...styles.themePreview,
              background: CHAT_WALLPAPERS[key] || "var(--bg-soft)",
            }}
          />
          {key}
        </button>
      ))}
    </div>
  </div>
)}

{showMenu && (
  <div className="menuPopup">
    <div className="menuItem">Visit profile</div>
    <div className="menuItem">Block user</div>
    <div className="menuItem">Report user</div>

    <div
      className="menuItem"
      onClick={() => {
        setShowThemePicker((v) => !v);
        setShowWallpaperPicker(false);
      }}
    >
      Chat theme
    </div>

    <div
      className="menuItem"
      onClick={() => {
        setShowWallpaperPicker((v) => !v);
        setShowThemePicker(false);
      }}
    >
      Wallpaper
    </div>
  </div>
)}
          </div>
        </div>

        <div
  style={{
    ...styles.body,
    background: CHAT_WALLPAPERS[chatWallpaper] || "var(--bg)",
  }}
>
          {loading ? <div className="muted">Loading chat...</div> : null}
          {err ? <div style={styles.err}>{err}</div> : null}

          {msgs.map((m) => (
  <div
    key={m.id}
    style={{
      display: "flex",
      justifyContent: m.sender === "me" ? "flex-end" : "flex-start",
      marginBottom: 12,
    }}
  >
    <div
      onDoubleClick={() => setActiveReaction(m.id)}
      style={{
        ...styles.bubble,
        ...(m.sender === "me"
          ? {
              ...styles.meBubble,
              background: CHAT_THEMES[chatTheme]?.meBubble,
            }
          : styles.otherBubble),
      }}
    >

      {/* text message */}
      {m.text && (
        <div style={styles.msgText}>
          {m.text}
        </div>
      )}

{m.sender === "me" && (
  <div style={styles.msgStatus}>
    {m.status === "sent" ? "✓" : "✓✓"}
  </div>
)}
      {/* image message */}
      {m.type === "image" && (
        <img
          src={m.url}
          alt="media"
          style={{
            maxWidth: 220,
            borderRadius: 12,
            display: "block",
          }}
        />
      )}

      {/* message time */}
      <div style={styles.msgTime}>
        {formatTime(m.createdAt)}
      </div>

      {/* selected reaction */}
      {m.reaction && (
        <div style={styles.reactionBadge}>
          {m.reaction}
        </div>
      )}

      {/* reaction picker */}
      {activeReaction === m.id && (
        <div style={styles.reactionBar}>
          {["❤️","😂","😮","😢","🔥","👍"].map((emoji) => (
            <span
              key={emoji}
              style={styles.reactionItem}
              onClick={() => {
                toggleReaction(m.id, emoji)
                setActiveReaction(null)
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

    </div>
  </div>
))}

{isTyping && (
  <div style={styles.typingBox}>
    typing...
  </div>
)}

<div ref={endRef}></div>
</div>

<div style={styles.inputBar}>         {showPlus && (
  <div className="plusMenu">

    <div
      className="plusItem"
      onClick={() => fileRef.current?.click()}
    >
      🖼️
    </div>

    <div
      className="plusItem"
      onClick={() => fileRef.current?.click()}
    >
      🎥
    </div>

    <div className="plusItem">
      📷
    </div>

    <div className="plusItem">
      GIF
    </div>

    <div className="plusItem">
      😊
    </div>

  </div>
)}

          <button
 style={styles.plusBtn}
 onClick={() => setShowPlus(!showPlus)}
>
 ＋
</button>

          <textarea
  value={text}
  onChange={(e) => {
    setText(e.target.value)

    setIsTyping(true)

    clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      setIsTyping(false)
    },1500)
  }}
  onKeyDown={onKeyDown}
  placeholder="Type a message..."
  style={styles.input}
  rows={1}
/>
          <button style={styles.sendBtn} onClick={onSend} disabled={sending}>
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

const CHAT_THEMES = {
  insta: {
    meBubble: "linear-gradient(135deg, #ff7a18, #ff2d55 55%, #8a3ffc)",
    accent: "#ff2d55",
  },
  midnight: {
    meBubble: "linear-gradient(135deg, #232526, #414345)",
    accent: "#7c5cff",
  },
  ocean: {
    meBubble: "linear-gradient(135deg, #00c6ff, #0072ff)",
    accent: "#0072ff",
  },
  rose: {
    meBubble: "linear-gradient(135deg, #f953c6, #b91d73)",
    accent: "#f953c6",
  },
};

const CHAT_WALLPAPERS = {
  none: "",
  softDark:
    "radial-gradient(circle at top left, rgba(124,92,255,.08), transparent 26%), var(--bg)",
  instaGlow:
    "radial-gradient(circle at top left, rgba(255,122,24,.14), transparent 24%), radial-gradient(circle at bottom right, rgba(138,63,252,.16), transparent 28%), var(--bg)",
  ocean:
    "radial-gradient(circle at top left, rgba(0,198,255,.16), transparent 25%), radial-gradient(circle at bottom right, rgba(0,114,255,.14), transparent 28%), var(--bg)",
};
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = {
  msgStatus:{
  fontSize:11,
  opacity:0.6,
  marginTop:2,
  textAlign:"right"
},
  typingBox:{
  fontSize:13,
  opacity:0.7,
  marginBottom:10,
  paddingLeft:10
},

msgText: {
  fontSize: 15,
  lineHeight: 1.4
},

reactionBar: {
  marginTop: 6,
  display: "flex",
  gap: 6,
  background: "var(--card)",
  border: "1px solid var(--line)",
  padding: "4px 8px",
  borderRadius: 999,
  width: "fit-content"
},

reactionItem: {
  fontSize: 16,
  cursor: "pointer",
  padding: "2px 4px"
},

reactionBadge: {
  marginTop: 4,
  fontSize: 14
},

  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    paddingBottom: 0,
    pickerCard: {
  margin: "10px 12px 0",
  padding: 14,
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "var(--card)",
},

pickerTitle: {
  fontSize: 14,
  fontWeight: 800,
  color: "var(--text)",
  marginBottom: 10,
},

themeGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
},

themeChip: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 14,
  background: "var(--bg-soft)",
  color: "var(--text)",
  cursor: "pointer",
  textTransform: "capitalize",
},

themePreview: {
  width: 28,
  height: 28,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.15)",
  flex: "0 0 auto",
},

reactionBadge: {
  marginTop: 6,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 28,
  height: 24,
  borderRadius: 999,
  padding: "0 8px",
  fontSize: 13,
  background: "rgba(255,255,255,.16)",
  backdropFilter: "blur(10px)",
},
  },
  shell: {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  top: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    borderBottom: "1px solid var(--line)",
    background: "var(--bg)",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    color: "var(--text)",
    background: "var(--bg-soft)",
    border: "1px solid var(--line)",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)",
  },
  name: {
    color: "var(--text)",
    fontWeight: 800,
  },
  sub: {
    color: "var(--muted)",
    fontSize: 13,
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    padding: "16px 12px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background:
      "radial-gradient(circle at top left, rgba(124,92,255,.08), transparent 26%), var(--bg)",
  },
  bubbleRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 20,
    padding: "10px 12px 8px",
    fontSize: 15,
    lineHeight: 1.45,
    animation: "fadeUp .18s ease",
  },
  meBubble: {
    background: "linear-gradient(135deg, #7c5cff, #9b7bff)",
    color: "#fff",
    borderBottomRightRadius: 8,
  },
  otherBubble: {
    background: "var(--card)",
    color: "var(--text)",
    border: "1px solid var(--line)",
    borderBottomLeftRadius: 8,
  },
  msgTime: {
    marginTop: 4,
    fontSize: 11,
    opacity: 0.78,
    textAlign: "right",
  },
  inputBar: {
    position: "sticky",
    bottom: 0,
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    padding: "12px",
    borderTop: "1px solid var(--line)",
    background: "var(--bg)",
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    color: "var(--text)",
    fontSize: 24,
    cursor: "pointer",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    resize: "none",
    borderRadius: 18,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    color: "var(--text)",
    padding: "12px 14px",
    outline: "none",
    fontFamily: "inherit",
  },
  sendBtn: {
    border: 0,
    borderRadius: 14,
    padding: "12px 16px",
    background: "linear-gradient(135deg,#ff7a18,#ff2d55 55%,#8a3ffc)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  err: {
    alignSelf: "center",
    borderRadius: 14,
    padding: "10px 12px",
    color: "#ff6b6b",
    background: "rgba(255,59,48,0.10)",
    border: "1px solid rgba(255,59,48,0.18)",
  },
};