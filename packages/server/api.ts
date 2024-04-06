const API = {
  openapi: "3.0.3",
  info: {
    "title": "Lexome - OpenAPI 3.0",
    "description": "This is Lexome",
    "contact": {
      "email": "neal@lexome.com"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "1.0.11"
  },
  "servers": [
    {
      "url": "https://api.lexome.com/"
    }
  ],
  "paths": {
    "/enhancements/{id}": {
      "get": {
        "operationId": "getEnhancement",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Enhancement"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Enhancement not found"
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    },
    "/enhancements": {
      "get": {
        "summary": "Get enhancements by book",
        "operationId": "getEnhancements",
        "parameters": [
          {
            "name": "bookId",
            "in": "query",
            "description": "Book to filter by",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Enhancement"
                  }
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Book not found"
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      },
      "post": {
        "summary": "Create enhancement",
        "description": "Create a new enhancement",
        "operationId": "createEnhancement",
        "requestBody": {
          "description": "Create a new enhancement",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "bookId",
                  "title",
                  "includedTypes"
                ],
                "properties": {
                  "book_id": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "title": {
                    "type": "string"
                  },
                  "included_types": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "format": "uuid"
                    }
                  }
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Enhancement"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized"
          },
          "400": {
            "description": "Invalid input"
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    },
    "/subscribed-enhancements": {
      "get": {
        "summary": "Finds enhancements user is subscribed to",
        "operationId": "getSubscribedEnhancements",
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Enhancement"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    }
  },
  "components": {
    "schemas": {
      "EnhancementType": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          }
        }
      },
      "Enhancement": {
        "type": "object",
        "required": [
          "book_id",
          "title",
          "included_types"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "title": {
            "type": "string"
          },
          "data": {
            "type": "string"
          },
          "book_id": {
            "type": "string",
            "format": "uuid"
          },
          "included_types": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EnhancementType"
            }
          },
          "subscriptions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Subscription"
            }
          }
        }
      },
      "Subscription": {
        "type": "object",
        "properties": {
          "user_id": {
            "type": "string",
            "format": "uuid"
          },
          "role": {
            "type": "string"
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}