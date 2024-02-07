import { User } from './user.model';

export interface Role {
  Name?: string;
  Description?: string;
  users?: User[];
}
