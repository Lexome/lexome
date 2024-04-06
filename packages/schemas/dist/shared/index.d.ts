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
export declare const version: z.ZodObject<{
    major: z.ZodNumber;
    minor: z.ZodNumber;
    patch: z.ZodNumber;
    preRelease: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    major: number;
    minor: number;
    patch: number;
    preRelease?: string | undefined;
}, {
    major: number;
    minor: number;
    patch: number;
    preRelease?: string | undefined;
}>;
