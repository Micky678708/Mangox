import {useState} from "react"

export default function ChatInput(){

const [text,setText]=useState("")

function send(){

if(!text) return

console.log(text)

setText("")

}

return(

<div className="chatInput">

<input

value={text}

onChange={e=>setText(e.target.value)}

placeholder="Message..."

/>

<button onClick={send}>➤</button>

</div>

)

}