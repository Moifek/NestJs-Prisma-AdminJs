import { Post } from './post.model';
import { Tag } from './tag.model';
export interface PostTag {
  post?: Post;
  postID?: number;
  tag?: Tag;
  tagID?: number;
}
