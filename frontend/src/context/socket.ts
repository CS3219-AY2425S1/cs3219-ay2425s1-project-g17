import io from "socket.io-client";

const socket = io(process.env.REACT_APP_COLLABORATION_SOCKET_URI ?? "http://localhost:4003");

export default socket;