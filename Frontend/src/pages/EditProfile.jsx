import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateMeApi } from "../api/profile.js";

export default function EditProfile() {
  const { user, reloadMe } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const save = async () => {
    setErr(""); setMsg("");
    try {
      await updateMeApi({ name, bio });
      await reloadMe();
      setMsg("Profile updated ✅");
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="pagePad">
      <div className="card">
        <div className="h1">Edit Profile</div>
        {err ? <div className="alert">{err}</div> : null}
        {msg ? <div className="ok">{msg}</div> : null}

        <div className="stack">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" rows={4} />
          <button className="btn btnPrimary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
