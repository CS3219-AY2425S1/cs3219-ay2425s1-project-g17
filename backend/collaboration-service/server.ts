import dotenv from "dotenv";
import { httpServer } from "./app";

dotenv.config();

const port = process.env.PORT ?? '';

httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});