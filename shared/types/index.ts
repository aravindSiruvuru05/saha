import { UUID } from 'crypto';

export interface IWithID {
  id: UUID;
}

export interface IApiRes<T> {
  data: T;
}
