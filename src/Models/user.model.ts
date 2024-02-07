import { Post } from './post.model';
import { Role } from './role.model';

export interface User {
  id: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  provider?: string;
  email?: string;
  password: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  admin?: boolean;
  roleId?: string;
  Posts?: Post[];
  role?: Role;
}
