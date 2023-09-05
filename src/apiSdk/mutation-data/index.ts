import axios from 'axios';
import queryString from 'query-string';
import { MutationDataInterface, MutationDataGetQueryInterface } from 'interfaces/mutation-data';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMutationData = async (
  query?: MutationDataGetQueryInterface,
): Promise<PaginatedInterface<MutationDataInterface>> => {
  const response = await axios.get('/api/mutation-data', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createMutationData = async (mutationData: MutationDataInterface) => {
  const response = await axios.post('/api/mutation-data', mutationData);
  return response.data;
};

export const updateMutationDataById = async (id: string, mutationData: MutationDataInterface) => {
  const response = await axios.put(`/api/mutation-data/${id}`, mutationData);
  return response.data;
};

export const getMutationDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/mutation-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMutationDataById = async (id: string) => {
  const response = await axios.delete(`/api/mutation-data/${id}`);
  return response.data;
};
