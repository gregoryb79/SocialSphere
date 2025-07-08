import { io } from "socket.io-client";

const URL = "http://localhost:5050";
export const socket = io(URL);