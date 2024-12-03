import { startStandaloneServer } from "@apollo/server/standalone";

import { server } from "./server";
import { getAuthenticatedUserId } from "../services/auth";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const host = process.env.HOST || '0.0.0.0'

startStandaloneServer(server, {
  listen: {
    port,
    host
  },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization
    const jwt = authHeader && authHeader.split(' ')[1]

    let userId: string | null = null

    try {
      if (jwt) {
        userId = getAuthenticatedUserId({ token: jwt })
      }
    } catch (error) {
      console.error(error)
    }

    return {
      userId
    }
  }
});

console.log(`🚀 Server ready at ${host}:${port}`);
