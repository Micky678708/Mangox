import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function ChatSidebar(){

const [query,setQuery] = useState("")
const [users,setUsers] = useState([])

async function searchUser(e){

const q = e.target.value
setQuery(q)

if(q.length < 2){
setUsers([])
return
}

const res = await axios.get(`/api/chat/users/search?q=${q}`)
setUsers(res.data)

}

return(

<div className="chatSidebar">

<h2>Chats</h2>

<input
placeholder="Search user..."
value={query}
onChange={searchUser}
/>

{users.map(u=>(

<Link key={u._id} to={`/chat/${u.id}`}>

<div className="chatItem">

<div className="avatar"/>

<div>

<div>{u.username}</div>

<div style={{opacity:.6,fontSize:12}}>
Start chat
</div>

</div>

</div>

</Link>

))}

</div>

)

}