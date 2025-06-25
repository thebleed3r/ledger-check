import { ReasonMessageLabels, ReasonType } from '../enums/reason-type.enum';

export type Reason =
  | {
      type: ReasonType.OUT_OF_BOUNDS;
      message: ReasonMessageLabels;
      details: {
        movementId: number;
      };
    }
  | {
      type: ReasonType.DUPLICATE;
      message: ReasonMessageLabels;
      details: {
        movementId: number;
      };
    }
  | {
      type: ReasonType.BALANCE_MISMATCH;
      message: ReasonMessageLabels;
      details: {
        balanceStartDate: Date;
        balanceEndDate: Date;
        expectedFinalBalance: number;
        calculatedFinalBalance: number;
      };
    }
  | {
      type: ReasonType.UNVERIFIABLE_MOVEMENTS;
      message: ReasonMessageLabels;
    };
