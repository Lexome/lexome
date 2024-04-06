import zod from 'zod';
export type Illustration = zod.infer<typeof illustrationSchema>;
export declare const illustrationSchema: zod.ZodObject<{
    id: zod.ZodString;
    version: zod.ZodObject<{
        major: zod.ZodNumber;
        minor: zod.ZodNumber;
        patch: zod.ZodNumber;
        preRelease: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
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
    illustrations: zod.ZodArray<zod.ZodObject<{
        id: zod.ZodString;
        anchor: zod.ZodObject<{
            id: zod.ZodString;
            word: zod.ZodString;
            prefixHash: zod.ZodString;
            suffixHash: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
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
        image: zod.ZodString;
        createdAt: zod.ZodDate;
        postedBy: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        image: string;
        createdAt: Date;
        postedBy: string;
    }, {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        image: string;
        createdAt: Date;
        postedBy: string;
    }>, "many">;
}, "strip", zod.ZodTypeAny, {
    id: string;
    version: {
        major: number;
        minor: number;
        patch: number;
        preRelease?: string | undefined;
    };
    illustrations: {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        image: string;
        createdAt: Date;
        postedBy: string;
    }[];
}, {
    id: string;
    version: {
        major: number;
        minor: number;
        patch: number;
        preRelease?: string | undefined;
    };
    illustrations: {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        image: string;
        createdAt: Date;
        postedBy: string;
    }[];
}>;
