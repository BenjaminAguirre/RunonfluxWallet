import express from "express";
import bodyParser from "body-parser";
import fluxRouter from "./router/fluxRouter.js"


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));//middleware que transforam req.body a un json


app.use("/api", fluxRouter)


const PORT = 8080;


app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});