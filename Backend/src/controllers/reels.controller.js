import Reel from "../models/Reel.js"

export const getReels = async (req,res)=>{
try{

const reels = await Reel.find()
.sort({createdAt:-1})
.populate("user","username name")

res.json({
success:true,
data:reels
})

}catch(e){
res.status(500).json({message:e.message})
}
}

export const getReelById = async (req,res)=>{
try{

const reel = await Reel.findById(req.params.id)

res.json(reel)

}catch(e){
res.status(500).json({message:e.message})
}
}

export const likeReel = async (req,res)=>{
try{

const reel = await Reel.findById(req.params.id)

if(!reel.likes.includes(req.user._id)){
reel.likes.push(req.user._id)
}

await reel.save()

res.json({success:true})

}catch(e){
res.status(500).json({message:e.message})
}
}

export const commentReel = async (req,res)=>{
try{

res.json({
success:true,
message:"comment added"
})

}catch(e){
res.status(500).json({message:e.message})
}
}

export const saveReel = async (req,res)=>{
try{

const reel = await Reel.findById(req.params.id)

if(!reel.saves.includes(req.user._id)){
reel.saves.push(req.user._id)
}

await reel.save()

res.json({success:true})

}catch(e){
res.status(500).json({message:e.message})
}
}

export const unsaveReel = async (req,res)=>{
try{

const reel = await Reel.findById(req.params.id)

reel.saves = reel.saves.filter(
id => id.toString() !== req.user._id.toString()
)

await reel.save()

res.json({success:true})

}catch(e){
res.status(500).json({message:e.message})
}
}