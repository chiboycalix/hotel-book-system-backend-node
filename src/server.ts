import chalk from "chalk";
import app from "./app";
import { PORT } from "./configs/env";

app.listen(PORT, async() => {
  console.log(chalk.hex("#3c3").bold(`Server listening on port ${PORT}`));
});

export default app;
