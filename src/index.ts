import WebSocket from "ws";
import SocketClient from "./socket_client_tcp";

const { MessageParser } = require("./utils");

const port = Number(process.env.PORT ?? "8080");
const wss = new WebSocket.Server({ port });

wss.on("connection", (ws, req) => {
  console.log(req.url);
  if (req.url === undefined) {
    throw new Error("No url");
  }
  const [protocol, host, port] = req.url.split("/").splice(1);
  const mp = new MessageParser((body: any) => {
    ws.send(body);
  });
  const socket = new SocketClient(
    {
      onConnect: () => {},
      onClose: (...args:any[])=>{
        console.log("Connection close", args);
        ws.close();
      },
      onRecv: (chunk: any) => {
        mp.run(chunk);
      },
      onEnd: () => {},
      onError: (...args:any[])=>{
        console.log("Connection error", args);
        ws.close()
      },
    },
    host,
    Number(port),
    protocol,
    {}
  );
  socket.connect();
  ws.on("message", (msg) => socket.send(msg));
});
