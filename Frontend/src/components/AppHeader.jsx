import { Link } from "react-router-dom";

export default function AppHeader({ to = "/", title = "MangoX" }) {
  return (
    <header style={styles.header}>
      <Link to={to} style={styles.brand}>
        <img src="/MangoX.png" alt="MangoX" style={styles.logo} />
        <span style={styles.title}>{title}</span>
      </Link>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "10px 14px",
    background: "rgba(30,30,30,0.75)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    objectFit: "cover",
  },
  title: {
    color: "#fff",
    fontWeight: 800,
    letterSpacing: 0.3,
    fontSize: 18,
  },
};