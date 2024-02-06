import { PostTag } from "./postTag.model.js"
import { User } from "./user.model.js"

export interface Post{
    id?: number
    title?: string
    content?: string
    author?: User
    authorID?: number
    published?: boolean
    postTags?: PostTag[]
  }