import React from "react"
import "../styles/auth.css"

const FlotingInput = ({ type = "text", label, value, onChange }) => {
  return (
    <div className="floatingInput">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
      />
      <label>{label}</label>
    </div>
  )
}

export default FlotingInput