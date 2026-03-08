import React, { useState } from "react";

export default function EditProfile() {
  const [name, setName] = useState("mango_dev");
  const [bio, setBio] = useState("Newlyweds • daily life..");

  const onSave = (e) => {
    e.preventDefault();
    alert("Edit profile UI ready ✅ (API next)");
  };

  return (
    <div className="pagePad">
      <div className="card">
        <div className="h1">Edit Profile</div>
        <div className="muted">Avatar upload + backend next</div>

        <form onSubmit={onSave} className="formGrid">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button className="btn btnPrimary">Save</button>
        </form>
      </div>
    </div>
  );
}
