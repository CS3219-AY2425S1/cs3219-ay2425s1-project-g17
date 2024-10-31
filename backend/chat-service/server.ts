import dotenv from "dotenv";
import { httpServer } from "./app";

dotenv.config();

const port = process.env.PORT || 4005;

httpServer.listen(port, () => {
    console.log(`Chat service running on port ${port}`);
});
