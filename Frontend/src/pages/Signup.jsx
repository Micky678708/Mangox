import React,{useState} from "react"
import {useNavigate} from "react-router-dom"

export default function Signup(){

const nav = useNavigate()

const [step,setStep] = useState(1)

const [email,setEmail] = useState("")
const [username,setUsername] = useState("")
const [name,setName] = useState("")
const [password,setPassword] = useState("")

const [usernameOk,setUsernameOk] = useState(false)
const [usernameConfirmed,setUsernameConfirmed] = useState(false)

const checkUsername = async () =>{

/* future API */

if(username.length > 3){
setUsernameOk(true)
}

}

const createAccount = async () =>{

/* backend API */

localStorage.setItem("token","demo")

nav("/home")

}

return(

<div className="authPage">

<div className="authShell">

<div className="authCard">

{/* STEP 1 */}

{step === 1 && (

<div>

<h2>Signup</h2>

<input
className="authInput"
placeholder="Phone or Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<button
className="authBtn"
onClick={()=>setStep(2)}
>
Continue
</button>

</div>

)}

{/* STEP 2 */}

{step === 2 && (

<div>

<input
className="authInput"
placeholder="Username"
value={username}
onChange={e=>setUsername(e.target.value)}
onBlur={checkUsername}
/>

{usernameOk && !usernameConfirmed && (

<div style={{color:"green",marginTop:"6px"}}>
✔ Username available
</div>

)}

{usernameOk && !usernameConfirmed && (

<button
className="authBtn"
onClick={()=>setUsernameConfirmed(true)}
>
Confirm
</button>

)}

{usernameConfirmed && (

<div style={{marginTop:"15px"}}>

<input
className="authInput"
placeholder="Full Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<button
className="authBtn"
onClick={()=>setStep(3)}
>
Continue
</button>

</div>

)}

</div>

)}

{/* STEP 3 */}

{step === 3 && (

<div>

<input
className="authInput"
type="password"
placeholder="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<p style={{fontSize:"13px",opacity:.7}}>
Min 6 characters
</p>

<button
className="authBtn"
onClick={createAccount}
>
Create Account
</button>

</div>

)}

</div>

</div>

</div>

)

}