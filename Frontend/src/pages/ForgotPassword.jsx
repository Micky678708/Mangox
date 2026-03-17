import React,{useState} from "react"

const API="https://mangox-jhei.onrender.com"

export default function ForgotPassword(){

const [identifier,setIdentifier]=useState("")
const [user,setUser]=useState(null)
const [step,setStep]=useState(1)

const [otp,setOtp]=useState("")
const [newPassword,setNewPassword]=useState("")

// FIND ACCOUNT
const findAccount=async()=>{

try{

const res=await fetch(`${API}/api/auth/find-id?query=${identifier}`)
const data=await res.json()

if(data.success){

setUser(data.data.user)
setStep(2)

}else{

alert(data.message)

}

}catch(err){
console.log(err)
}

}

// SEND OTP
const sendOtp=async()=>{

try{

const res=await fetch(`${API}/api/auth/request-otp`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
identifier,
purpose:"forgot_password"
})
})

const data=await res.json()

if(data.success){

alert("OTP sent")
setStep(3)

}else{

alert(data.message)

}

}catch(err){
console.log(err)
}

}

// VERIFY OTP
const verifyOtp=async()=>{

try{

const res=await fetch(`${API}/api/auth/verify-otp`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
identifier,
purpose:"forgot_password",
otp
})
})

const data=await res.json()

if(data.success){

setStep(4)

}else{

alert(data.message)

}

}catch(err){
console.log(err)
}

}

// RESET PASSWORD
const resetPassword=async()=>{

try{

const res=await fetch(`${API}/api/auth/reset-password-otp`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
identifier,
purpose:"forgot_password",
otp,
newPassword
})
})

const data=await res.json()

if(data.success){

alert("Password updated")

window.location.href="/home"

}else{

alert(data.message)

}

}catch(err){
console.log(err)
}

}

return(

<div className="forgotPage">

{step===1 &&(

<div>

<h2>Find your account</h2>

<input
placeholder="Phone, username or email"
value={identifier}
onChange={(e)=>setIdentifier(e.target.value)}
/>

<button onClick={findAccount}>
Continue
</button>

</div>

)}

{step===2 &&(

<div>

<h3>Account found</h3>

<p>{user.username}</p>

<button onClick={sendOtp}>
Send OTP
</button>

</div>

)}

{step===3 &&(

<div>

<h3>Enter OTP</h3>

<input
placeholder="OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
/>

<button onClick={verifyOtp}>
Verify OTP
</button>

</div>

)}

{step===4 &&(

<div>

<h3>Reset password</h3>

<input
type="password"
placeholder="New password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
/>

<button onClick={resetPassword}>
Reset password
</button>

</div>

)}

</div>

)

}
