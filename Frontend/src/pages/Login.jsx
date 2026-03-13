import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"
import FlotingInput from "../components/FlotingInput"

const Login = () => {

const navigate = useNavigate()

const [identifier,setIdentifier] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)
const [error,setError] = useState("")

const handleLogin = async () => {

try{

setLoading(true)
setError("")

const res = await fetch(
process.env.VITE_API_URL + "/auth/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
identifier,
password
})
})

const data = await res.json()

if(!res.ok){
throw new Error(data.message || "Login failed")
}

localStorage.setItem("token",data.token)

navigate("/")

}catch(err){

setError(err.message)

}finally{

setLoading(false)

}

}

return(

<div className="authContainer">

<div className="authBox">

<div className="logo">
MangoX
</div>

<FlotingInput
label="Email, username or phone"
value={identifier}
onChange={(e)=>setIdentifier(e.target.value)}
/>

<FlotingInput
type="password"
label="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="authButton"
onClick={handleLogin}
disabled={loading}
>

{loading ? "Logging in..." : "Log in"}

</button>

{error && (
<p className="errorText">{error}</p>
)}

<div
className="authLink"
onClick={()=>navigate("/forgot")}
>
Forgot password?
</div>

<div
className="authLink"
onClick={()=>navigate("/signup")}
>
Create new account
</div>

</div>

</div>

)

}

export default Login