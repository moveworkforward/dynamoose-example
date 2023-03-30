import { mapper } from "../mapper";
import { createMap } from "@automapper/core";
import { Comment } from "./comment.entity";
import { CommentDto } from "./comment.dto";

createMap(mapper, Comment, CommentDto);

export { Comment, CommentDto };
