import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const checkVouchers = async (flightNumber: string, date: string) => {
  const response = await api.post('/check', { flightNumber, date });
  return response.data;
};

export const generateVouchers = async (data: {
  name: string;
  id: string;
  flightNumber: string;
  date: string;
  aircraft: string;
}) => {
  const response = await api.post('/generate', data);
  return response.data;
};
