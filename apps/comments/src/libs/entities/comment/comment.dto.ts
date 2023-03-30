import { AutoMap } from "@automapper/classes";

export class CommentDto {
    @AutoMap()
    postId!: string;
    
    @AutoMap()
    commentId?: string;

    @AutoMap()
    authorId!: string;

    @AutoMap()
    created?: Date;

    @AutoMap()
    updated?: Date;

    @AutoMap()
    text!: string;

    @AutoMap(() => [String])
    tags?: string[];
}
