import React,{useState} from "react"

const API="https://mangox-jhei.onrender.com"

export default function ForgotPassword(){

const [identifier,setIdentifier]=useState("")
const [user,setUser]=useState(null)
const [step,setStep]=useState(1)

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

const sendOtp=async(type)=>{

try{

const res=await fetch(`${API}/api/auth/request-otp`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
identifier,
purpose:"forgot_password",
method:type
})
})

const data=await res.json()

if(data.success){

alert("OTP sent")

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

<div className="findAccount">

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

<div className="otpOptions">

<h3>Choose where to send OTP</h3>

<button onClick={()=>sendOtp("app")}>
Send OTP to MangoX App </button>

<button onClick={()=>sendOtp("email")}>
Send OTP to Email ({user.email}) </button>

<button onClick={()=>sendOtp("phone")}>
Send OTP to Phone ({user.phone}) </button>

</div>

)}

</div>

)

}
