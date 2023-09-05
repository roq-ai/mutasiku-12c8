import axios from 'axios';
import queryString from 'query-string';
import { AccountBalanceInterface, AccountBalanceGetQueryInterface } from 'interfaces/account-balance';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getAccountBalances = async (
  query?: AccountBalanceGetQueryInterface,
): Promise<PaginatedInterface<AccountBalanceInterface>> => {
  const response = await axios.get('/api/account-balances', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createAccountBalance = async (accountBalance: AccountBalanceInterface) => {
  const response = await axios.post('/api/account-balances', accountBalance);
  return response.data;
};

export const updateAccountBalanceById = async (id: string, accountBalance: AccountBalanceInterface) => {
  const response = await axios.put(`/api/account-balances/${id}`, accountBalance);
  return response.data;
};

export const getAccountBalanceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/account-balances/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAccountBalanceById = async (id: string) => {
  const response = await axios.delete(`/api/account-balances/${id}`);
  return response.data;
};
