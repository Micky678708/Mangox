export default function MessageBubble({message}){
    return(

        <div className={message.mine?"msg mine":"msg"}>

            {message.text}
            
        </div>
    )
}