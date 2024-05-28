import { startStandaloneServer } from "@apollo/server/standalone";

import { server } from "./server";

startStandaloneServer(server, {
  listen: {
    port: 4000,
  }
});

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
