import type { Model } from "dynamoose/dist/Model";
import { logAsync } from "../common/log";
import { model as newModel } from "dynamoose";
import { SortOrder } from "dynamoose/dist/General";
import { Comment } from "../entities/comment";
import { CommentSchema } from "../schemas/comment.schema";
import { omit } from "lodash";

interface CommentRepositoryType {
    getCommentByPostIdAndCommentId: (postId: string, commentId: string) => Promise<Comment>;
    getComments: () => Promise<Comment[]>;
    getCommentsByPostId: (postId: string) => Promise<Comment[]>;
    findCommentsByAuthorId: (authorId: string, sortOrder: string, limit: number) => Promise<Comment[]>;
    createComment: (comment: Comment) => Promise<Comment>;
    updateComment: (product: Comment) => Promise<Comment>;
}

export class CommentRepository implements CommentRepositoryType {
    private dbInstance: Model<Comment>;

    constructor() {
        const tableName = `${process.env.STAGE}-example-db-comments`;
        this.dbInstance = newModel<Comment>(tableName, CommentSchema);
    }

    @logAsync()
    async getCommentByPostIdAndCommentId(postId: string, commentId: string): Promise<Comment> {
        return await this.dbInstance.get({ postId: postId, commentId: commentId });
    }

    @logAsync()
    async getComments(): Promise<Comment[]> {
        return await this.dbInstance.scan().all().exec();
    }

    @logAsync()
    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        return await this.dbInstance.query({ "postId": postId }).all().exec();
    }

    @logAsync()
    async findCommentsByAuthorId(authorId: string, sortOrder: string = "descending", limit: number = -1): Promise<Comment[]> {
        const sortOrderType = (sortOrder == "descending") ? SortOrder.descending : SortOrder.ascending;
        const query = this.dbInstance.query({ authorId: authorId }).using(CommentSchema.getAttributeSettingValue("index", "authorId").name).sort(sortOrderType);
        if (limit === -1) {
            query.all();
        }
        else {
            query.limit(limit);
        }

        return await query.exec();
    }

    @logAsync()
    async createComment(comment: Comment): Promise<Comment> {
        const newComment = await this.dbInstance.create(comment);
        newComment.created = new Date(newComment.created);
        newComment.updated = new Date(newComment.updated);

        return newComment;
    }

    @logAsync()
    async updateComment(comment: Comment): Promise<Comment> {
        const commentData = omit(comment, ['created', 'updated']);
        return await this.dbInstance.update(commentData);
    }
}
