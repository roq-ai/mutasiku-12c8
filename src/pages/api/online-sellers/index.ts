import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { onlineSellerValidationSchema } from 'validationSchema/online-sellers';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getOnlineSellers();
    case 'POST':
      return createOnlineSeller();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOnlineSellers() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.online_seller
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'online_seller'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createOnlineSeller() {
    await onlineSellerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bank_account?.length > 0) {
      const create_bank_account = body.bank_account;
      body.bank_account = {
        create: create_bank_account,
      };
    } else {
      delete body.bank_account;
    }
    if (body?.user_invitation?.length > 0) {
      const create_user_invitation = body.user_invitation;
      body.user_invitation = {
        create: create_user_invitation,
      };
    } else {
      delete body.user_invitation;
    }
    const data = await prisma.online_seller.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
