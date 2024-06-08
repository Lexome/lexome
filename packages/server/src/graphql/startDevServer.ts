import { startStandaloneServer } from "@apollo/server/standalone";

import { server } from "./server";

startStandaloneServer(server, {
  listen: {
    port: 8080,
    host: '0.0.0.0'
  }
});

console.log(`🚀 Server ready at 0.0.0.0:8080`);
