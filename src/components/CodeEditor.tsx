import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:4001");

const CodeEditor = () => {
  // Get Room ID from Matching Service
  const room = "TESTROOMID123"

  const [message, setMessage] = useState("");

  socket.emit("join_room", room);

  const sendMessage = (message: string) => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.message);
      setMessage(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <h1>Room ID: {room}</h1> <p>TODO: Retrieve ID from Matching Service</p>

      <textarea
        rows = {30}
        cols = {100}
        value = {message}
        onChange={(event) => {
          setMessage(event.target.value);
          sendMessage(event.target.value);
        }}
      />
    </div>
  );
}

export default CodeEditor;