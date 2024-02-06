import { Post } from './post.model.js'
import { Tag } from './tag.model.js'
export interface PostTag{
    post?: Post
    postID?: number
    tag?: Tag
    tagID?: number
  }
  