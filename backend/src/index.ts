import { App } from "./App";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = new App().express;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
