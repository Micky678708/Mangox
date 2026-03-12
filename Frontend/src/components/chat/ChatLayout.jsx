import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}