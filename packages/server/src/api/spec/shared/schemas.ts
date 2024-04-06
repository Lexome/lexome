export const enhancementTypeSchema = {
  '$ref': '#/components/schemas/enhancementType'
}

export const subscriptionSchema = {
  '$ref': '#/components/schemas/subscription'
}

export const authorSchema = {
  '$ref': '#/components/schemas/author'
}

export const bookSchema = {
  '$ref': '#/components/schemas/book'
}

export const enhancementSchema = {
  '$ref': '#/components/schemas/enhancement'
}

const enhancementTypeInternal = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid"
    }
  }
}

const subscriptionInternal = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
      format: "uuid"
    },
    role: {
      type: "string"
    }
  }
}

const authorInternal = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid"
    },
    name: {
      type: "string"
    }
  }
}

const bookInternal = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid"
    },
    cover_url: {
      type: "string"
    },
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    authors: {
      type: "array",
      items: authorSchema
    },
  }
}

const enhancementInternal = {
  type: "object",
  required: [
    "book_id",
    "title",
    "included_types"
  ],
  properties: {
    id: {
      type: "string",
      format: "uuid"
    },
    title: {
      type: "string"
    },
    data: {
      type: "string"
    },
    book_id: {
      type: "string",
      format: "uuid"
    },
    included_types: {
      type: "array",
      items: enhancementTypeSchema
    },
    subscriptions: {
      type: "array",
      items: subscriptionSchema
    }
  }
}

export const schemas = {
  enhancementType: enhancementTypeInternal,
  subscription: subscriptionInternal,
  author: authorInternal,
  book: bookInternal,
  enhancement: enhancementInternal,
}

