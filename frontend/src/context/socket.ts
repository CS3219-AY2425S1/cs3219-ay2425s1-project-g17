import io from "socket.io-client";

const socket = io("http://localhost:4003");

export default socket;