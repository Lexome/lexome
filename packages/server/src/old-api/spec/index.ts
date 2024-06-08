import { securitySchemes } from "./shared/misc";
import { routesSpec as enhancementRoutes } from "../enhancements";
import { routesSpec as bookRoutes } from "../books";
import { schemas } from "./shared/schemas";

export const apiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Lexome - OpenAPI 3.0",
    description: "This is Lexome",
    contact: {
      email: "neal@lexome.com"
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    version: "1.0.11"
  },
  servers: [
    {
      url: "https://api.lexome.com/"
    }
  ],
  paths: {
    ...enhancementRoutes,
    ...bookRoutes,
  },
  components: {
    schemas,
    securitySchemes
  }
}