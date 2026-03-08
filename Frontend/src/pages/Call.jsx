import React from "react";
import { useParams } from "react-router-dom";

export default function Call() {
  const { id } = useParams();
  return (
    <div className="pagePad">
      <div className="card">
        <div style={{ fontWeight: 900, fontSize: 22 }}>Call</div>
        <div className="small">Calling user: {id} (UI only)</div>
      </div>
    </div>
  );
}
