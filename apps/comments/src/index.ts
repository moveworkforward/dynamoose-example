require("source-map-support").install();

import { Logger } from "./libs/common/log";
import { CommentDto } from "./libs/entities/comment";
import { CommentService, CommentServiceHelper } from "./libs/services/comment.service";
import { v4 as random_uuid } from "uuid";

const commentService = new CommentService();

export const createComment = async (comentData: any): Promise<CommentDto> => {
    const comment = await commentService.createComment(comentData);
    const commentDto = CommentServiceHelper.toDto(comment);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Created comment:")
    Logger.info(comment);

    return commentDto;
}

export const updateComment = async (existingComment: any, comentData: any): Promise<CommentDto> => {
    const comment = await commentService.updateComment(existingComment, comentData);
    const commentDto = CommentServiceHelper.toDto(comment);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Updated comment:")
    Logger.info(comment);

    return commentDto;
}

export const getComment = async (postId: string, commentId: string): Promise<CommentDto> => {
    const comment = await commentService.getCommentByPostIdAndCommentId(postId, commentId);
    const commentDto = CommentServiceHelper.toDto(comment);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Fetched single comment:")
    Logger.info(comment);

    return commentDto;
}

export const getCommentsForPost = async (postId: string): Promise<CommentDto[]> => {
    const comments = await commentService.getCommentsByPostId(postId);
    const commentDtos = CommentServiceHelper.toDtos(comments);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Fetched comments for post:")
    Logger.info(comments);

    return commentDtos;
}

export const getCommentsByAuthor = async (authorId: string): Promise<CommentDto[]> => {
    const comments = await commentService.getCommentsByAuthorId(authorId, "descending");
    const commentDtos = CommentServiceHelper.toDtos(comments);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Fetched comments by author:")
    Logger.info(comments);

    return commentDtos;
}

export const getComments = async (): Promise<CommentDto[]> => {
    const comments = await commentService.getComments();
    const commentDtos = CommentServiceHelper.toDtos(comments);

    Logger.info("\n\n-------------------------------------------------------------");
    Logger.info("Fetched all comments:")
    Logger.info(comments);

    return commentDtos;
}

/* Define Test Data */

const comment1Data: any = {
    postId: random_uuid(),
    authorId: random_uuid(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in pellentesque nibh, lacinia ultricies enim.",
    tags: [
        "walk",
        "political",
        "insightful"
    ]
}

const comment2Data: any = {
    postId: comment1Data.postId,
    authorId: random_uuid(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in pellentesque nibh, lacinia ultricies enim.",
    tags: [
        "walk",
        "political",
        "insightful"
    ]
}

/* Execute Tests */

// Create First Comment for the Post
createComment(comment1Data)
    // Create Second Comment for the Post
    .then(() => createComment(comment2Data))
    // Update the Second Comment for the Post
    .then((commentDto: CommentDto) => {
        const updateCommentData: CommentDto = {
            postId: commentDto.postId,
            commentId: commentDto.commentId,
            authorId: commentDto.authorId,
            text: "Donec in pellentesque nibh, lacinia ultricies enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
            tags: [
                "run",
                "dumb"
            ]
        }

        return updateComment(commentDto, updateCommentData);
    })
    .then((commentDto: CommentDto) => getComment(commentDto.postId, commentDto.commentId))
    // Get All Comments for the Post
    .then(() => getCommentsForPost(comment1Data.postId))
    // Get ALl Comments by the Author of the First Comment
    .then(() => getCommentsByAuthor(comment1Data.authorId))
    // Get All Comments
    .then(() => getComments());

// Update a Comment
/*const updateCommentData: any = {
    postId: newCommentData.postId,
    commentId: newCommentData.commentId,
    authorId: newCommentData.authorId,
    text: "Donec in pellentesque nibh, lacinia ultricies enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
    tags: [
        "run",
        "dumb"
    ]
}*/
