import { Injectable, Type } from '@nestjs/common';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { Policy } from './interfaces/policy.interface';

@Injectable()
export class PolicyHandlerStorage {
  // in the case of keys we work on types not concrete instances as we want to enable developers to manually instantiate and configure policies (ex: diff endpoints, diff requirements)
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();

  // Cls = class
  add<T extends Policy>(policyCls: Type<T>, handler: PolicyHandler<T>) {
    this.collection.set(policyCls, handler);
  }

  get<T extends Policy>(policyCls: Type<T>): PolicyHandler<T> | undefined {
    const handler = this.collection.get(policyCls);

    if (!handler) {
      throw new Error(
        `"${policyCls.name}" does not have the associated handler.`,
      );
    }

    return handler;
  }
}
