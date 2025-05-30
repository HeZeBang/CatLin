import socketIOClient from "socket.io-client";
import { post } from "./fetcher";

const endpoint = window.location.hostname + ":" + window.location.port;

export const socket = socketIOClient(endpoint);

socket.on("connect", () => {
    post("/api/initsocket", { socketid: socket.id });
});
