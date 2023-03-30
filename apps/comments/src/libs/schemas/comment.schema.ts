import { Schema } from "dynamoose";
import validator from "validator";

export const CommentSchema = new Schema(
    {
        postId: {
            hashKey: true,
            required: true,
            type: String,
        },
        commentId: {
            rangeKey: true,
            required: true,
            type: String,
        },
        authorId: {
            type: String,
            required: true,
            validate: (value) => validator.isUUID(value.toString(), 4),
            index: {
                name: "gsiAuthorIdIndex",
                type: "global",
            },
        },
        text: {
            type: String,
            required: true,
            validate: (value) => !validator.isEmpty(value.toString(), { ignore_whitespace: true }),
        },
        tags: {
            type: Array,
            required: false,
            schema: [String],
        }
    },
    {
        timestamps: {
            createdAt: {
                created: {
                    type: {
                        value: Date,
                        settings: {
                            storage: "milliseconds",
                        },
                    },
                },
            },
            updatedAt: {
                updated: {
                    type: {
                        value: Date,
                        settings: {
                            storage: "milliseconds",
                        },
                    },
                },
            },
        },
        saveUnknown: false,
    },
);
