"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.illustrationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const shared_1 = require("./shared");
exports.illustrationSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    version: shared_1.version,
    illustrations: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.string().uuid(),
        anchor: shared_1.anchor,
        image: zod_1.default.string(),
        createdAt: zod_1.default.date(),
        postedBy: zod_1.default.string().uuid(),
    })),
});
