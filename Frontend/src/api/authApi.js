import client from "./client";

export const loginUser = async (req,res)=>{

const {identifier,password} = req.body

const user = await User.findOne({
$or:[
{email:identifier},
{username:identifier},
{phone:identifier}
]
})

if(!user){
return res.status(400).json({message:"User not found"})
}

const valid = await bcrypt.compare(password,user.password)

if(!valid){
return res.status(400).json({message:"Invalid password"})
}

const token = generateToken(user._id)

res.json({
token,
user
})

}
export async function signupApi(payload) {
  const { data } = await client.post("/api/auth/signup", payload);
  return data;
}

export async function requestOtpApi(payload) {
  const { data } = await client.post("/api/auth/request-otp", payload);
  return data;
}

export async function verifyOtpApi(payload) {
  const { data } = await client.post("/api/auth/verify-otp", payload);
  return data;
}

export async function resetPasswordOtpApi(payload) {
  const { data } = await client.post("/api/auth/reset-password-otp", payload);
  return data;
}

export async function findIdApi() {
  const { data } = await client.get("/api/auth/find-id");
  return data;
}