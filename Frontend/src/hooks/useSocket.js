import { useEffect,useState } from "react"
import { io } from "socket.io-client"

export default function useSocket(){

const [socket,setSocket] = useState(null)

useEffect(()=>{

const s = io("https://mangox-jhei.onrender.com")

setSocket(s)

return ()=> s.disconnect()

},[])

return socket

}