import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { bankAccountValidationSchema } from 'validationSchema/bank-accounts';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBankAccounts();
    case 'POST':
      return createBankAccount();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBankAccounts() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.bank_account
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'bank_account'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createBankAccount() {
    await bankAccountValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.account_balance?.length > 0) {
      const create_account_balance = body.account_balance;
      body.account_balance = {
        create: create_account_balance,
      };
    } else {
      delete body.account_balance;
    }
    if (body?.mutation_data?.length > 0) {
      const create_mutation_data = body.mutation_data;
      body.mutation_data = {
        create: create_mutation_data,
      };
    } else {
      delete body.mutation_data;
    }
    const data = await prisma.bank_account.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
