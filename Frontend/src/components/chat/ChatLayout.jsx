import "./Chat.css"
import ChatSidebar from "./ChatSidebarTEMP";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}