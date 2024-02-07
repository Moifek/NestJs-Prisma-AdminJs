import { user } from '@prisma/client';
import { IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  password: string;
  @IsString()
  roleId: string;
  @IsString()
  email: string;
}
