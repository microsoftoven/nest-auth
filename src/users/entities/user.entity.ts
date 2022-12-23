import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  // Having this column in combination with a role does not make sense. we're just going to add this for the purposes of the course
  @Column({ enum: Permission, default: [], type: 'json' }) // it'd be a m:m relationship in a users/permissions table
  permissions: PermissionType[];
}
