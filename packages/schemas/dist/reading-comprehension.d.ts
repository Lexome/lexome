import zod from 'zod';
export type ReadingComprehension = zod.infer<typeof readingComprehensionSchema>;
export declare const readingComprehensionSchema: zod.ZodObject<{
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
    questions: zod.ZodArray<zod.ZodObject<{
        id: zod.ZodString;
        createdBy: zod.ZodString;
        createdAt: zod.ZodDate;
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
        question: zod.ZodString;
        answer: zod.ZodOptional<zod.ZodString>;
        choices: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            id: zod.ZodString;
            value: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            value: string;
        }, {
            id: string;
            value: string;
        }>, "many">>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        createdAt: Date;
        createdBy: string;
        question: string;
        answer?: string | undefined;
        choices?: {
            id: string;
            value: string;
        }[] | undefined;
    }, {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        createdAt: Date;
        createdBy: string;
        question: string;
        answer?: string | undefined;
        choices?: {
            id: string;
            value: string;
        }[] | undefined;
    }>, "many">;
    responses: zod.ZodArray<zod.ZodObject<{
        id: zod.ZodString;
        userId: zod.ZodString;
        questionId: zod.ZodString;
        value: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        value: string;
        userId: string;
        questionId: string;
    }, {
        id: string;
        value: string;
        userId: string;
        questionId: string;
    }>, "many">;
}, "strip", zod.ZodTypeAny, {
    id: string;
    version: {
        major: number;
        minor: number;
        patch: number;
        preRelease?: string | undefined;
    };
    questions: {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        createdAt: Date;
        createdBy: string;
        question: string;
        answer?: string | undefined;
        choices?: {
            id: string;
            value: string;
        }[] | undefined;
    }[];
    responses: {
        id: string;
        value: string;
        userId: string;
        questionId: string;
    }[];
}, {
    id: string;
    version: {
        major: number;
        minor: number;
        patch: number;
        preRelease?: string | undefined;
    };
    questions: {
        id: string;
        anchor: {
            id: string;
            word: string;
            prefixHash: string;
            suffixHash: string;
        };
        createdAt: Date;
        createdBy: string;
        question: string;
        answer?: string | undefined;
        choices?: {
            id: string;
            value: string;
        }[] | undefined;
    }[];
    responses: {
        id: string;
        value: string;
        userId: string;
        questionId: string;
    }[];
}>;
