// src/app/pages/AppChat.jsx — Chat in app shell context
import Chat from "../../pages/Chat";

export default function AppChat() {
  return (
    <div style={{ margin: "-40px -48px", height: "100vh" }}>
      <Chat embedded />
    </div>
  );
}
