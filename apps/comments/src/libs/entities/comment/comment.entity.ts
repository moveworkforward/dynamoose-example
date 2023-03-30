import { Item } from "dynamoose/dist/Item";
import { AutoMap } from "@automapper/classes";

export class Comment extends Item {
    @AutoMap()
    postId!: string;
    
    @AutoMap()
    commentId!: string;

    @AutoMap()
    authorId!: string;

    @AutoMap()
    created!: Date;

    @AutoMap()
    updated!: Date;

    @AutoMap()
    text!: string;

    @AutoMap(() => [String])
    tags?: string[];
}
