import { logAsync } from "../common/log";
import { mapper } from "../entities/mapper";
import { Comment, CommentDto } from "../entities/comment";
import { CommentRepository } from "../repositories/comment.repository";
import { v4 as random_uuid } from "uuid";

const commentRepository = new CommentRepository();

interface CommentServiceType {
    getComments: () => Promise<Comment[]>;
    getCommentByPostIdAndCommentId: (postId: string, commentId: string) => Promise<Comment>;
    getCommentsByPostId: (postId: string, sortOrder: string, limit: number) => Promise<Comment[]>;
    getCommentsByAuthorId: (authorId: string, sortOrder: string, limit: number) => Promise<Comment[]>;
    createComment: (comment: Comment) => Promise<Comment>;
    updateComment: (existingComment: Comment, comment: Comment) => Promise<Comment>;
}

export class CommentService implements CommentServiceType {
    @logAsync()
    async getComments(): Promise<Comment[]> {
        return await commentRepository.getComments();
    }

    @logAsync()
    async getCommentByPostIdAndCommentId(postId: string, commentId: string): Promise<Comment> {
        return await commentRepository.getCommentByPostIdAndCommentId(postId, commentId);
    }

    @logAsync()
    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        const commentsPrimaryKeys = await commentRepository.getCommentsByPostId(postId);
        if (!commentsPrimaryKeys.length) {
            return [];
        }

        return await Promise.all(commentsPrimaryKeys.map((comment: Comment) => commentRepository.getCommentByPostIdAndCommentId(comment.postId, comment.commentId)));
    }

    @logAsync()
    async getCommentsByAuthorId(authorId: string, sortOrder: string, limit: number = -1): Promise<Comment[]> {
        const commentsPrimaryKeys = await commentRepository.findCommentsByAuthorId(authorId, sortOrder, limit);
        if (!commentsPrimaryKeys.length) {
            return [];
        }

        return await Promise.all(commentsPrimaryKeys.map((comment: Comment) => commentRepository.getCommentByPostIdAndCommentId(comment.postId, comment.commentId)));
    }

    @logAsync()
    async createComment(comment: Comment): Promise<Comment> {
        // Business logic goes here, for example:
        // Validate that the user has a permission to create a comment for this post
        // Filter post text so that it does not include HTML
        // Save attached images in S3
        // etc.

        comment.commentId = random_uuid();
        return await commentRepository.createComment(comment);
    }

    @logAsync()
    async updateComment(existingComment: Comment, comment: Comment): Promise<Comment> {
        // Business logic goes here, for example:
        // Validate that the user has a permission to create a comment for this post
        // Filter post text so that it does not include HTML
        // Save attached images in S3
        // etc.

        comment.postId = existingComment.postId;
        comment.commentId = existingComment.commentId;

        return await commentRepository.updateComment(comment);
    }
}

export class CommentServiceHelper {
    static async toDto(comment: Comment): Promise<CommentDto> {
        return mapper.map(comment, Comment, CommentDto);
    }

    static async toDtos(comments: Comment[]): Promise<CommentDto[]> {
        return comments.length ? await Promise.all(comments.map((comment: Comment) => this.toDto(comment))) : [];
    }
}
