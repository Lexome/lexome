import * as z from 'zod';
export declare const anchor: z.ZodObject<{
    id: z.ZodString;
    word: z.ZodString;
    prefixHash: z.ZodString;
    suffixHash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    word: string;
    prefixHash: string;
    suffixHash: string;
}, {
    id: string;
    word: string;
    prefixHash: string;
    suffixHash: string;
}>;
