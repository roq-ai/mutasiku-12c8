import axios from 'axios';
import queryString from 'query-string';
import { BankAccountInterface, BankAccountGetQueryInterface } from 'interfaces/bank-account';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBankAccounts = async (
  query?: BankAccountGetQueryInterface,
): Promise<PaginatedInterface<BankAccountInterface>> => {
  const response = await axios.get('/api/bank-accounts', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBankAccount = async (bankAccount: BankAccountInterface) => {
  const response = await axios.post('/api/bank-accounts', bankAccount);
  return response.data;
};

export const updateBankAccountById = async (id: string, bankAccount: BankAccountInterface) => {
  const response = await axios.put(`/api/bank-accounts/${id}`, bankAccount);
  return response.data;
};

export const getBankAccountById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bank-accounts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBankAccountById = async (id: string) => {
  const response = await axios.delete(`/api/bank-accounts/${id}`);
  return response.data;
};
