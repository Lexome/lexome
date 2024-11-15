import zod from "zod";
import { anchorOptional } from "./shared/anchor-v1";

const replySchema = zod.object({
  id: zod.string().uuid(),
  message: zod.string(),
  createdAt: zod.string().datetime().optional(),
  updatedAt: zod.string().datetime(),
  author: zod.object({
    id: zod.string().uuid(),
    displayName: zod.string(),
  }),
  replies: zod.lazy(() => replySchema.array()),
})

export type Reply = Omit<zod.infer<typeof replySchema>, "replies"> & {
  replies: Reply[];
}

export const threadSchema = zod.object({
  id: zod.string().uuid(),
  anchor: anchorOptional,
  message: zod.string(),
  createdAt: zod.string().datetime(),
  updatedAt: zod.string().datetime(),
  author: zod.object({
    id: zod.string().uuid(),
    displayName: zod.string(),
  }),
  replies: replySchema.array(),
})

export type Thread = Omit<zod.infer<typeof threadSchema>, "replies"> & {
  replies: Reply[];
}

export type Discussion = {
  threads: Thread[];
  repliesAllowed: boolean;
}

export const discussionSchema = zod.object({
  threads: threadSchema.array(),
  repliesAllowed: zod.boolean(),
})