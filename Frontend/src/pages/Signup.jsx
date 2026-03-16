import React, { useState } from "react";

const API = "https://mangox-jhei.onrender.com";

export default function Signup() {

const [form, setForm] = useState({
phone: "",
email: "",
password: "",
day: "",
month: "",
year: "",
username: "",
name: ""
});

const [usernameStatus, setUsernameStatus] = useState("");
const [checkingUsername, setCheckingUsername] = useState(false);
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value.trim()
});
};

const checkUsername = async (username) => {

if (!username || username.length < 3) {
setUsernameStatus("");
return;
}

try {

setCheckingUsername(true);

const res = await fetch(`${API}/api/auth/check-username/${username}`);
const data = await res.json();

if (data?.available === true) {
setUsernameStatus("available");
} else {
setUsernameStatus("taken");
}

} catch (err) {
console.log("Username check error:", err);
setUsernameStatus("");
}

setCheckingUsername(false);
};

const getPasswordStrength = (password) => {

if (password.length < 6) return "Weak";

if (
/[A-Z]/.test(password) &&
/[0-9]/.test(password) &&
/[^A-Za-z0-9]/.test(password)
) {
return "Strong";
}

return "Medium";
};

const validateForm = () => {

if (!form.username) {
alert("Username required");
return false;
}

if (!form.phone && !form.email) {
alert("Phone or Email required");
return false;
}

if (form.password.length < 6) {
alert("Password must be at least 6 characters");
return false;
}

const age = new Date().getFullYear() - parseInt(form.year || "0");

if (age < 15) {
alert("Age must be 15+");
return false;
}

if (usernameStatus === "taken") {
alert("Username already used");
return false;
}

return true;
};

const handleSubmit = async (e) => {

e.preventDefault();

if (!validateForm()) return;

try {

setLoading(true);

const res = await fetch(`${API}/api/auth/signup`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(form)
});

const data = await res.json();

console.log("Signup response:", data);

// flexible token handling
const token =
data?.data?.accessToken ||
data?.accessToken ||
data?.token;

const refreshToken =
data?.data?.refreshToken ||
data?.refreshToken;

if (token) {

localStorage.setItem("token", token);

if (refreshToken) {
localStorage.setItem("refreshToken", refreshToken);
}

console.log("TOKEN SAVED:", token);

alert("Signup successful 🎉");

window.location.href = "/home";

} else {

alert(data?.message || "Signup failed");

}

} catch (err) {

console.log("Signup error:", err);
alert("Server error");

}

setLoading(false);
};

return (

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

<p className="passStrength">
Password strength: {getPasswordStrength(form.password)}
</p>

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
onChange={(e) => {
handleChange(e);
checkUsername(e.target.value);
}}
/>

{checkingUsername && (

<p style={{ color: "#888" }}>Checking username...</p>
)}

{usernameStatus === "available" && (

<p style={{ color: "green" }}>✔ Username available</p>
)}

{usernameStatus === "taken" && (

<p style={{ color: "red" }}>Username already used</p>
)}

<input
name="name"
placeholder="Full name"
onChange={handleChange}
/>

<button className="signupBtn" disabled={loading}>
{loading ? "Creating..." : "Create Account"}
</button>

</form>

</div>

</div>

);
}
