export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
  }
}

export const defaultSecurityRule = {
  security: [
    {
      bearerAuth: []
    }
  ]
}

export const defaultErrors = {
  "403": {
    description: "Unauthorized"
  },
  "404": {
    description: "Enhancement not found"
  }
}

export const success = (schema: any) => ({
  "200": {
    description: "Successful operation",
    content: {
      "application/json": {
        schema
      }
    }
  }
})

export const getByIdParams = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        format: "uuid"
      }
    }
  ]
}