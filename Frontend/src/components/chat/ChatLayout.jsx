import "./Chat.css"
import ChatSidebar from "./ChatSidebarTEMP";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="ChatLayout">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}