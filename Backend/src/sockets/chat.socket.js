export default function chatSocket(io) {

let users = []

io.on("connection",(socket)=>{

socket.on("addUser",(userId)=>{

const exist = users.find(u=>u.userId===userId)

if(!exist){
users.push({userId,socketId:socket.id})
}

})

socket.on("sendMessage",({senderId,receiverId,text})=>{

const user = users.find(u=>u.userId===receiverId)

if(user){

io.to(user.socketId).emit("getMessage",{
senderId,
text
})

}

})

socket.on("disconnect",()=>{
users = users.filter(u=>u.socketId !== socket.id)
})

})

}