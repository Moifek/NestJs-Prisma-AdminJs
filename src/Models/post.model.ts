import { PostTag } from './postTag.model';
import { User } from './user.model';

export interface Post {
  id?: number;
  title?: string;
  content?: string;
  author?: User;
  authorID?: number;
  published?: boolean;
  postTags?: PostTag[];
}
