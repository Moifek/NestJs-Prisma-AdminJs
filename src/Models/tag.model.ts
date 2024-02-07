import { PostTag } from './postTag.model';

export interface Tag {
  id?: number;
  name?: string;
  description?: string;
  postTags?: PostTag[];
}
