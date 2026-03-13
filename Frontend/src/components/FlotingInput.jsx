import "../../styles/auth.css"

function FloatingInput({ type, label }) {
  return (
    <div className="inputBox">
      <input type={type} required />
      <label>{label}</label>
    </div>
  )
}

export default FloatingInput