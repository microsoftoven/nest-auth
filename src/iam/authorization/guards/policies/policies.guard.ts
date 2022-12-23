import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { POLICIES_KEY } from '../../decorators/policies.decorator';
import { Policy } from '../../policies/interfaces/policy.interface';
import { PolicyHandlerStorage } from '../../policies/policy-handlers.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (policies) {
      const user: ActiveUserData = context.switchToHttp().getRequest()[
        REQUEST_USER_KEY
      ];
      await Promise.all(
        policies.map((policy) => {
          const policyhandler = this.policyHandlerStorage.get(
            policy.constructor as Type, // to retrieve the handler we have to pass the policy constructor reference because storage associates handlers with classes, not instances
          );
          return policyhandler.handle(policy, user);
        }),
      ).catch((err) => {
        throw new ForbiddenException(err.message);
      });
    }

    return true;
  }
}
