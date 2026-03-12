export default function ChatSidebar(){

const chats=[

{ id:1,name:"Rahul",msg:"Hey bro",time:"2:30"},
{ id:2,name:"Aman",msg:"Video bhej",time:"1:10"},
{ id:3,name:"Neha",msg:"Nice reel",time:"Yesterday"}

]

return(

<div className="chatSidebar">

<div className="chatHeader">

<h3>Chats</h3>

</div>

{chats.map(c=>(

<div key={c.id} className="chatItem">

<div className="avatar"/>

<div className="chatInfo">

<div className="chatName">{c.name}</div>
<div className="chatMsg">{c.msg}</div>

</div>

<div className="chatTime">{c.time}</div>

</div>

))}

</div>

)

}