import { startStandaloneServer } from "@apollo/server/standalone";

import { server } from "./server";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const host = process.env.HOST || '0.0.0.0'

startStandaloneServer(server, {
  listen: {
    port,
    host
  }
});

console.log(`🚀 Server ready at ${host}:${port}`);
