"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readingComprehensionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const shared_1 = require("./shared");
exports.readingComprehensionSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    version: shared_1.version,
    questions: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.string().uuid(),
        createdBy: zod_1.default.string().uuid(),
        createdAt: zod_1.default.date(),
        anchor: shared_1.anchor,
        question: zod_1.default.string(),
        answer: zod_1.default.optional(zod_1.default.string()),
        choices: zod_1.default.optional(zod_1.default.array(zod_1.default.object({
            id: zod_1.default.string().uuid(),
            value: zod_1.default.string(),
        })))
    })),
    responses: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.string().uuid(),
        userId: zod_1.default.string().uuid(),
        questionId: zod_1.default.string().uuid(),
        value: zod_1.default.string(),
    })),
});
