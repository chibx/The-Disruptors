import "dotenv/config";
import { app } from "./app";
import "./routes";

const PORT = parseInt(process.env.BK_PORT!) || 3000;
const HOST = process.env.BK_HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
    console.log("Server started on port ", PORT, " and host ", HOST);
});
