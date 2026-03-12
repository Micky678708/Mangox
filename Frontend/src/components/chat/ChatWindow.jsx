import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

export default function ChatWindow(){

const messages=[
{ id:1,text:"Hello",mine:false },
{ id:2,text:"Hi bro",mine:true },
{ id:3,text:"Kya haal",mine:false }
]

return(

<div className="chatWindow">

<div className="messages">

{messages.map(m=>(
<MessageBubble key={m.id} message={m}/>
))}

</div>

<ChatInput/>

</div>

)

}