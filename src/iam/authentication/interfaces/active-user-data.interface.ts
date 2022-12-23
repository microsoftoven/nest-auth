import { PermissionType } from 'src/iam/authorization/permission.type';
import { Role } from 'src/users/enums/role.enum';

// Note: we are not adding irrelevant properties
export interface ActiveUserData {
  /**
   * The "subject" of the token. THe value of this property is the user ID
   * that granted this token.
   */
  sub: number;

  /**
   * The subject's (user) email.
   */
  email: string;

  /**
   * The subject's (user) role.
   */
  role: Role;

  /**
   * Sub permissions (this would not be combined with role normally, this kind of stuff would be in pivot tables)
   */
  permissions: PermissionType[];
}
