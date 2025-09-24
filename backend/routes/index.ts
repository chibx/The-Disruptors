import { app } from "../app";

app.get("/", (_, res) => {
    return res.status(200).json({
        message: "Yo wassup",
    });
});
