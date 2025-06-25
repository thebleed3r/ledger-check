import { Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidateMovementsResponse } from './interfaces/validate-movements-response.interface';
import { ReasonMessageLabels, ReasonType } from './enums/reason-type.enum';
import { Reason } from './types/reason.type';
import { ResponseMessageLabels } from './enums/response-message.enum';
import { Balance } from './interfaces/balance.interface';
import { Movement } from './interfaces/movement.interface';

const BALANCE_TOLERANCE = 0.01;

@Injectable()
export class MovementsService {
  /**
   * Validates a list of movements against a series of control point balances.
   *
   * It performs the following checks:
   * - Detects movements outside of the controlled balance period.
   * - Identifies duplicated operations based on date, amount and label.
   * - Verifies that computed balances between control points match the expected values.
   * - A tolerance of 0.01 is applied to ignore floating point errors (less than 1 cent).
   * - Handles cases where validation is not possible (zero or single balance point).
   *
   * @param dto - The DTO containing the movements and balances to validate.
   * @returns A validation response indicating if the movements are valid, with potential reasons if not.
   *
   * Dates are assumed to be consistent across sources (normalization is not required by the problem statement)
   */
  public validateMovements(
    dto: ValidateMovementsDto,
  ): ValidateMovementsResponse {
    const sortedMovements: Movement[] = [...dto.movements].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const sortedBalances: Balance[] = [...dto.balances].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const reasons: Reason[] = [];

    // Unverifiable case: no or only one checkpoint
    if (sortedBalances.length === 0 || sortedBalances.length === 1) {
      reasons.push({
        type: ReasonType.UNVERIFIABLE_MOVEMENTS,
        message:
          sortedBalances.length === 0
            ? ReasonMessageLabels.UNVERIFIABLE_MOVEMENTS_NO_CHECK_POINT
            : ReasonMessageLabels.UNVERIFIABLE_MOVEMENTS_ONLY_ONE_CHECK_POINT,
      });
      return {
        message: ResponseMessageLabels.FAILED,
        reasons,
      };
    }

    const firstBalanceDate = sortedBalances[0].date;
    const lastBalanceDate = sortedBalances[sortedBalances.length - 1].date;

    // Detect out-of-bounds and duplicate movements
    const outOfBoundsAndDuplicateReasons = this.detectOutOfBoundsAndDuplicates(
      sortedMovements,
      firstBalanceDate,
      lastBalanceDate,
    );

    // Check balance mismatches between each pair of control points
    const balanceMisMatchReasons = this.checkBalanceMismatches(
      sortedBalances,
      sortedMovements,
    );

    reasons.push(...outOfBoundsAndDuplicateReasons, ...balanceMisMatchReasons);

    const response: ValidateMovementsResponse = {
      message:
        reasons.length === 0
          ? ResponseMessageLabels.ACCEPTED
          : ResponseMessageLabels.FAILED,
      reasons: reasons.length ? reasons : undefined,
    };

    return response;
  }

  private detectOutOfBoundsAndDuplicates(
    movements: Movement[],
    firstBalanceDate: Date,
    lastBalanceDate: Date,
  ): Reason[] {
    const duplicates = new Set<string>();
    const reasons: Reason[] = [];

    for (const movement of movements) {
      const key = `${movement.date.getTime()}-${movement.amount}-${movement.label}`;

      // Duplicate movement
      if (duplicates.has(key)) {
        reasons.push({
          type: ReasonType.DUPLICATE,
          message: ReasonMessageLabels.DUPLICATE,
          details: { movementId: movement.id },
        });
      } else {
        duplicates.add(key);
      }

      // Movement outside of control period
      if (movement.date < firstBalanceDate || movement.date > lastBalanceDate) {
        reasons.push({
          type: ReasonType.OUT_OF_BOUNDS,
          message: ReasonMessageLabels.OUT_OF_BOUNDS,
          details: { movementId: movement.id },
        });
      }
    }
    return reasons;
  }

  private checkBalanceMismatches(
    balances: Balance[],
    movements: Movement[],
  ): Reason[] {
    if (balances.length < 2) return [];
    const reasons: Reason[] = [];
    let movementIndex = 0;

    for (let i = 0; i < balances.length - 1; i++) {
      const start = balances[i];
      const end = balances[i + 1];
      let intervalSum = 0;

      // Process the movements in a single pass (already sorted)
      while (
        movementIndex < movements.length &&
        movements[movementIndex].date < end.date
      ) {
        if (movements[movementIndex].date >= start.date) {
          intervalSum += movements[movementIndex].amount;
        }
        movementIndex++;
      }
      const calculatedBalance = start.balance + intervalSum;
      const delta = calculatedBalance - end.balance;

      // Tolerance to floating point errors (0.01): ignore differences smaller than 1 cent
      if (Math.abs(delta) > BALANCE_TOLERANCE) {
        reasons.push({
          type: ReasonType.BALANCE_MISMATCH,
          message: this.getBalanceMismatchMessage(delta),
          details: {
            balanceStartDate: start.date,
            balanceEndDate: end.date,
            expectedFinalBalance: end.balance,
            calculatedFinalBalance: calculatedBalance,
          },
        });
      }
    }
    return reasons;
  }

  private getBalanceMismatchMessage(delta: number): ReasonMessageLabels {
    return delta < 0
      ? ReasonMessageLabels.NEGATIVE_BALANCE_MISMATCH
      : ReasonMessageLabels.POSITIVE_BALANCE_MISMATCH;
  }
}
