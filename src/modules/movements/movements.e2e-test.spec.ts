import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MovementsModule } from './movements.module';
import { ResponseMessageLabels } from './enums/response-message.enum';

describe('MovementsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MovementsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/movements/validation (POST)', async () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({
        movements: [
          {
            id: 1,
            date: '2025-06-01T00:00:00.000Z',
            label: 'Paycheck',
            amount: 2500,
          },
          {
            id: 2,
            date: '2025-06-05T12:34:56.000Z',
            label: 'Amazon',
            amount: -120,
          },
          {
            id: 3,
            date: '2025-06-10T09:00:00.000Z',
            label: 'Supermarket',
            amount: -85.5,
          },
          {
            id: 4,
            date: '2025-06-15T14:00:00.000Z',
            label: 'Salary Bonus',
            amount: 150,
          },
          {
            id: 5,
            date: '2025-06-20T18:30:00.000Z',
            label: 'Withdrawal ATM',
            amount: -200,
          },
          {
            id: 6,
            date: '2025-06-25T11:22:33.000Z',
            label: 'Amazon',
            amount: -59.99,
          },
          {
            id: 1,
            date: '2025-06-01T00:00:00.000Z',
            label: 'Paycheck',
            amount: 2500,
          },
        ],
        balances: [
          {
            date: '2025-06-02T00:00:00.000Z',
            balance: 1000,
          },
          {
            date: '2025-06-30T23:59:59.000Z',
            balance: 3084.51,
          },
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe(ResponseMessageLabels.FAILED);
        expect(res.body.reasons).toContainEqual(
          expect.objectContaining({
            type: 'DUPLICATE',
          }),
        );
        expect(res.body.reasons).toContainEqual(
          expect.objectContaining({
            type: 'BALANCE_MISMATCH',
          }),
        );
      });
  });
});
