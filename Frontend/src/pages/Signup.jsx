import React,{useState} from "react"

export default function Signup(){

const [form,setForm] = useState({
phone:"",
email:"",
password:"",
dob:"",
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

/* future API */
}

return(

<div className="signupPage">

<div className="signupCard">

<h2>Create MangoX account</h2>

<form onSubmit={handleSubmit}>

{/* row 1 */}

<div className="signupRow">

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

</div>

{/* row 2 */}

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>

{/* row 3 */}

<input
name="dob"
type="date"
onChange={handleChange}
/>

{/* row 4 */}

<div className="signupRow">

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

</div>

<button className="authBtn">
Create Account
</button>

</form>

</div>

</div>

)

}