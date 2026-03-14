import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {

const nav = useNavigate();

const [form,setForm] = useState({
name:"",
username:"",
email:"",
password:"",
confirmPassword:""
});

const [err,setErr] = useState("");

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const onSubmit = (e)=>{
e.preventDefault();

if(form.password !== form.confirmPassword){
setErr("Passwords do not match");
return;
}

/* future API call */

console.log("Signup data",form);

nav("/login");
};

return (

<div className="authPage">

<div className="authShell">

<div className="authCard">

<div className="brandRow brandCenter">
<img className="brandLogo" src="/Mangox.png" alt="mangox"/>
</div>

<label className="authLabel">Create MangoX account</label>

{err && <div className="authErr">{err}</div>}

<form onSubmit={onSubmit} className="authForm">

<div className="authField">
<input
name="name"
placeholder="Full name"
value={form.name}
onChange={handleChange}
required
/>
</div>

<div className="authField">
<input
name="username"
placeholder="Username"
value={form.username}
onChange={handleChange}
required
/>
</div>

<div className="authField">
<input
name="email"
placeholder="Email or phone"
value={form.email}
onChange={handleChange}
required
/>
</div>

<div className="authField">
<input
type="password"
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
required
/>
</div>

<div className="authField">
<input
type="password"
name="confirmPassword"
placeholder="Confirm password"
value={form.confirmPassword}
onChange={handleChange}
required
/>
</div>

<button className="authBtn">
Create account
</button>

</form>

<div className="authLinks center">

<span>Already have an account?</span>

<Link to="/login">
Log in
</Link>

</div>

</div>

</div>

</div>

);
}