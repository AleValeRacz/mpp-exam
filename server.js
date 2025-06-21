const http = require("http");
const { WebSocketServer } = require("ws");
const next = require("next");

// Optional: replace with actual random candidate logic
function getRandomCandidate() {
  const names = ["Alice", "Bob", "Charlie", "Diana", "Eli", "Fiona", "George", "Hannah"];
  const parties = ["Independent", "Democrat", "Republican", "Green", "Libertarian"];
  const descriptions = [
    "Experienced politician",
    "Community leader",
    "Tech-savvy innovator",
    "Environmentalist",
    "Healthcare reform advocate",
    "Veteran and public servant",
  ];

  const gender = Math.random() > 0.5 ? "men" : "women";
  const imageId = Math.floor(Math.random() * 100);

  return {
    id: Math.floor(Math.random() * 100000).toString(),
    name: names[Math.floor(Math.random() * names.length)],
    party: parties[Math.floor(Math.random() * parties.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    image: `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`,
  };
}


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(3000, () => {
    console.log("🚀 HTTP Server running on http://localhost:3000");
  });

  // Start WebSocket server on a separate port
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected");

    const interval = setInterval(() => {
      const candidate = getRandomCandidate();
      ws.send(JSON.stringify({ type: "newCandidate", data: candidate }));
    }, 3000);

    ws.on("close", () => {
      console.log("❌ Client disconnected");
      clearInterval(interval);
    });
  });
});
