import React,{useState} from "react"

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

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

const handleSubmit = (e)=>{
e.preventDefault()

console.log(form)
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

<p style={{marginBottom:"6px"}}>Date of Birth</p>

<div className="dobRow">

<input
name="day"
placeholder="DD"
maxLength="2"
onChange={handleChange}
/>

<input
name="month"
placeholder="MM"
maxLength="2"
onChange={handleChange}
/>

<input
name="year"
placeholder="YYYY"
maxLength="4"
onChange={handleChange}
/>

</div>

<input
name="username"
placeholder="Username"
onChange={handleChange}
/>

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