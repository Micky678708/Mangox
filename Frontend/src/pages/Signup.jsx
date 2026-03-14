import React,{useState} from "react"
import API from "../utils/api";

export default function Signup(){

const [form,setForm] = useState({
phone:"",
email:"",
password:"",
day:"",
month:"",
year:"",
username:"",
name:""
})

const [usernameStatus,setUsernameStatus] = useState("")

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

const checkUsername = async(username)=>{

if(username.length < 3){
setUsernameStatus("")
return
}

try{

const res = await fetch(`https://mangox-jhei.onrender.com/api/auth/check-username/${username}`)
const data = await res.json()

if(data.available){
setUsernameStatus("available")
}else{
setUsernameStatus("taken")
}

}catch(err){
console.log(err)
}

}

const validateForm = ()=>{

if(!form.phone && !form.email){
alert("Phone or Email required")
return false
}

if(form.password.length < 6){
alert("Password must be 6 characters")
return false
}

const age = new Date().getFullYear() - parseInt(form.year)

if(age < 15){
alert("Age must be 15+")
return false
}

return true
}

const handleSubmit = async(e)=>{

e.preventDefault()

if(!validateForm()) return

try{

const res = await fetch("https://mangox-jhei.onrender.com/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(form)
});

const data = await res.json()

if(data.token){

localStorage.setItem("token",data.token)

window.location.href="/"

}else{

alert(data.message)

}

}catch(err){

console.log(err)

}

}

return(

<div className="signupPage">

<div className="signupCard">

<h2>Create MangoX account</h2>

<form onSubmit={handleSubmit}>

<input
name="phone"
placeholder="Phone number"
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>

<p>Date of Birth</p>

<div className="dobRow">

<input
name="day"
placeholder="DD"
onChange={handleChange}
/>

<input
name="month"
placeholder="MM"
onChange={handleChange}
/>

<input
name="year"
placeholder="YYYY"
onChange={handleChange}
/>

</div>

<input
name="username"
placeholder="Username"
onChange={(e)=>{
handleChange(e)
checkUsername(e.target.value)
}}
/>

{usernameStatus==="available" && (
<p style={{color:"green"}}>✔ Username available</p>
)}

{usernameStatus==="taken" && (
<p style={{color:"red"}}>Username already used</p>
)}

<input
name="name"
placeholder="Full name"
onChange={handleChange}
/>

<button className="signupBtn">
Create Account
</button>

</form>

</div>

</div>

)

}