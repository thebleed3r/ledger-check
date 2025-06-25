import { Reason } from '../types/reason.type';

export interface ValidateMovementsResponse {
  message: string;
  reasons?: Reason[];
}
