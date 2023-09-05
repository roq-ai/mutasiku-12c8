import axios from 'axios';
import queryString from 'query-string';
import { UserInvitationInterface, UserInvitationGetQueryInterface } from 'interfaces/user-invitation';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getUserInvitations = async (
  query?: UserInvitationGetQueryInterface,
): Promise<PaginatedInterface<UserInvitationInterface>> => {
  const response = await axios.get('/api/user-invitations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createUserInvitation = async (userInvitation: UserInvitationInterface) => {
  const response = await axios.post('/api/user-invitations', userInvitation);
  return response.data;
};

export const updateUserInvitationById = async (id: string, userInvitation: UserInvitationInterface) => {
  const response = await axios.put(`/api/user-invitations/${id}`, userInvitation);
  return response.data;
};

export const getUserInvitationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-invitations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserInvitationById = async (id: string) => {
  const response = await axios.delete(`/api/user-invitations/${id}`);
  return response.data;
};
