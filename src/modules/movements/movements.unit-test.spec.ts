import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ReasonMessageLabels, ReasonType } from './enums/reason-type.enum';
import { ResponseMessageLabels } from './enums/response-message.enum';

describe('MovementService', () => {
  let service: MovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsService],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateMovements', () => {
    it('should return "Accepted" when data is valid', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-06-01T00:00:00.000Z'),
            label: 'Payecheck',
            amount: 1000,
          },
          {
            id: 2,
            date: new Date('2025-06-02T00:00:00.000Z'),
            label: 'Amazon',
            amount: -100,
          },
        ],
        balances: [
          { date: new Date('2025-06-01T00:00:00.000Z'), balance: 1000 },
          { date: new Date('2025-06-03T00:00:00.000Z'), balance: 1900 },
        ],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.ACCEPTED);
      expect(result.reasons).toBeUndefined();
    });

    it('should return "Validation failed" with "UNVERIFIABLE_MOVEMENTS" reason when no checkpoints', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-06-01'),
            label: 'Payecheck',
            amount: 1000,
          },
        ],
        balances: [],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.FAILED);
      expect(result.reasons).toHaveLength(1);
      expect(result.reasons?.[0].type).toBe(ReasonType.UNVERIFIABLE_MOVEMENTS);
      expect(result.reasons?.[0].message).toBe(
        ReasonMessageLabels.UNVERIFIABLE_MOVEMENTS_NO_CHECK_POINT,
      );
    });

    it('should return "Validation failed" with "UNVERIFIABLE_MOVEMENTS" reason when only one checkpoint', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-06-01'),
            label: 'Payecheck',
            amount: 1000,
          },
        ],
        balances: [{ date: new Date('2025-06-01'), balance: 1000 }],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.FAILED);
      expect(result.reasons).toHaveLength(1);
      expect(result.reasons?.[0].type).toBe(ReasonType.UNVERIFIABLE_MOVEMENTS);
      expect(result.reasons?.[0].message).toBe(
        ReasonMessageLabels.UNVERIFIABLE_MOVEMENTS_ONLY_ONE_CHECK_POINT,
      );
    });

    it('should return "Validation failed" with "DUPLICATE" reason when duplicate movements', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-06-01'),
            label: 'Paycheck',
            amount: 1000,
          },
          {
            id: 1,
            date: new Date('2025-06-01'),
            label: 'Paycheck',
            amount: 1000,
          },
        ],
        balances: [
          { date: new Date('2025-06-01'), balance: 1000 },
          { date: new Date('2025-06-03'), balance: 2000 },
        ],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.FAILED);
      expect(result.reasons).toHaveLength(2);
      expect(result.reasons?.[0].type).toBe(ReasonType.DUPLICATE);
      expect(result.reasons?.[0].message).toBe(ReasonMessageLabels.DUPLICATE);
      if (result.reasons?.[0].type === ReasonType.DUPLICATE) {
        expect(result.reasons?.[0].details).toEqual({ movementId: 1 });
      }
    });

    it('should return "Validation failed" with "OUT_OF_BOUNDS" reason when movement is outside control period', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-05-30'),
            label: 'Payecheck',
            amount: 1000,
          },
          {
            id: 2,
            date: new Date('2025-06-04'),
            label: 'Amazon',
            amount: -100,
          },
        ],
        balances: [
          { date: new Date('2025-06-01'), balance: 1000 },
          { date: new Date('2025-06-03'), balance: 900 },
        ],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.FAILED);
      expect(result.reasons).toHaveLength(3);
      expect(result.reasons?.[0].type).toBe(ReasonType.OUT_OF_BOUNDS);
      expect(result.reasons?.[0].message).toBe(
        ReasonMessageLabels.OUT_OF_BOUNDS,
      );
      if (result.reasons?.[0].type === ReasonType.OUT_OF_BOUNDS) {
        expect(result.reasons?.[0].details).toEqual({ movementId: 1 });
      }
      expect(result.reasons?.[1].type).toBe(ReasonType.OUT_OF_BOUNDS);
      expect(result.reasons?.[1].message).toBe(
        ReasonMessageLabels.OUT_OF_BOUNDS,
      );
      if (result.reasons?.[1].type === ReasonType.OUT_OF_BOUNDS) {
        expect(result.reasons?.[1].details).toEqual({ movementId: 2 });
      }
    });

    it('should return "Validation failed" with "BALANCE_MISMATCH" reason when balance does not match', () => {
      const dto: ValidateMovementsDto = {
        movements: [
          {
            id: 1,
            date: new Date('2025-06-01'),
            label: 'Payecheck',
            amount: 1000,
          },
          {
            id: 2,
            date: new Date('2025-06-02'),
            label: 'Amazon',
            amount: -100,
          },
        ],
        balances: [
          { date: new Date('2025-06-01'), balance: 1000 },
          { date: new Date('2025-06-03'), balance: 1800 },
        ],
      };
      const result = service.validateMovements(dto);
      expect(result.message).toBe(ResponseMessageLabels.FAILED);
      expect(result.reasons).toHaveLength(1);
      expect(result.reasons?.[0].type).toBe(ReasonType.BALANCE_MISMATCH);
      if (result.reasons?.[0].type === ReasonType.BALANCE_MISMATCH) {
        expect(result.reasons?.[0].details).toEqual({
          balanceStartDate: new Date('2025-06-01'),
          balanceEndDate: new Date('2025-06-03'),
          expectedFinalBalance: 1800,
          calculatedFinalBalance: 1900,
        });
      }
    });
  });
});
