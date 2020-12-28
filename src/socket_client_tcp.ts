import net from "net";
import tls from 'tls'

const TIMEOUT = 10000;

class SocketClient {
  public client: net.Socket;

  private port: number;

  private host: string;

  constructor(
    self: any,
    host: string,
    port: number,
    protocol: string,
    options: any
  ) {
    let conn = new net.Socket();
    switch (protocol) {
      case "tcp":
        break;
      case "tls":
      case "ssl":
        conn = new tls.TLSSocket(conn, {
          isServer: false,
          ...options
        });
        break;
      default:
        throw new Error(`not supported protocol ${protocol}`);
    }
    this.host = host;
    this.port = port;
    initialize(self, conn);
    this.client = conn;
  }

  async connect() {
    const client = this.client;

    return new Promise((resolve, reject) => {
      const errorHandler = (e: any) => reject(e);
      client.connect(this.port, this.host, () => {
        client.removeListener("error", errorHandler);
        resolve();
      });
      client.on("error", errorHandler);
    });
  }

  async close() {
    this.client.end();
    this.client.destroy();
  }

  send(data: any) {
    this.client.write(data);
  }
}

function initialize(self: any, conn: net.Socket) {
  conn.setTimeout(TIMEOUT);
  conn.setEncoding("utf8");
  conn.setKeepAlive(true, 0);
  conn.setNoDelay(true);

  conn.on("connect", () => {
    conn.setTimeout(0);
    self.onConnect();
  });

  conn.on("close", (e) => {
    self.onClose(e);
  });

  conn.on("timeout", () => {
    const e = new Error("ETIMEDOUT") as any;
    e.errorno = "ETIMEDOUT";
    e.code = "ETIMEDOUT";
    e.connect = false;
    conn.emit("error", e);
  });

  conn.on("data", (chunk) => {
    conn.setTimeout(0);
    self.onRecv(chunk);
  });

  conn.on("end", (e: any) => {
    conn.setTimeout(0);
    self.onEnd(e);
  });

  conn.on("error", (e) => {
    self.onError(e);
  });
}

export default SocketClient;
