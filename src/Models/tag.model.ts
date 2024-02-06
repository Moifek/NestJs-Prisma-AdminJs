import { PostTag } from "./postTag.model.js"

export interface Tag{
    id?: number
    name?: string
    description?: string
    postTags?: PostTag[]
  }
