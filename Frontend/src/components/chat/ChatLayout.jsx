import "./Chat.css";
import ChatSidebar from "./ChatSidebarTEMP";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="chatLayout">
      <div className="chatSidebarWrap">
        <ChatSidebar />
      </div>

      <div className="chatWindowWrap">
        <ChatWindow />
      </div>
    </div>
  );
}