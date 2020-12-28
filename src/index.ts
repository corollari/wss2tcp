import WebSocket from "ws";
import SocketClient from "./socket_client_tcp";

const { MessageParser } = require("./utils");

const port = Number(process.env.PORT ?? "8080");
const wss = new WebSocket.Server({ port });

wss.on("connection", function connection(ws, req) {
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
      onClose: ws.onclose,
      onRecv: (chunk: any) => {
        mp.run(chunk);
      },
      onEnd: () => {},
      onError: ws.onerror,
    },
    host,
    Number(port),
    protocol,
    {}
  );
  socket.connect();
  ws.on("message", (msg) => socket.send(msg));
});
