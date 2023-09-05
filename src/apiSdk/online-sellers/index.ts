import axios from 'axios';
import queryString from 'query-string';
import { OnlineSellerInterface, OnlineSellerGetQueryInterface } from 'interfaces/online-seller';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOnlineSellers = async (
  query?: OnlineSellerGetQueryInterface,
): Promise<PaginatedInterface<OnlineSellerInterface>> => {
  const response = await axios.get('/api/online-sellers', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createOnlineSeller = async (onlineSeller: OnlineSellerInterface) => {
  const response = await axios.post('/api/online-sellers', onlineSeller);
  return response.data;
};

export const updateOnlineSellerById = async (id: string, onlineSeller: OnlineSellerInterface) => {
  const response = await axios.put(`/api/online-sellers/${id}`, onlineSeller);
  return response.data;
};

export const getOnlineSellerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/online-sellers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOnlineSellerById = async (id: string) => {
  const response = await axios.delete(`/api/online-sellers/${id}`);
  return response.data;
};
