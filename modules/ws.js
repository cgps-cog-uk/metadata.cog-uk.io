
import http from "http";
import WebSocket from "ws";

export default function () {
  this.nuxt.hook("render:before", (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app);

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise((resolve) => server.listen(port || 3000, host || "localhost", resolve));
    // close this server on 'close' event
    this.nuxt.hook("close", () => new Promise(server.close));

    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      console.log("Client connected");
      ws.on("close", () => console.log("Client disconnected"));
    });

    setInterval(() => {
      wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
      });
    }, 1000);
  });
}
