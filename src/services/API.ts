import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const sendOtp = async (token: string) => {
  return axios.post(`${API_BASE}/send-otp/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const verifyOtp = async (otp: string, token: string) => {
  return axios.post(`${API_BASE}/verify-otp/`, { otp }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const checkVerification = async (token: string) => {
  return axios.get(`${API_BASE}/check-verification/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getProfile = async (token: string) => {
  return axios.get(`${API_BASE}/profile/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateStudent = (payload: any, token: string) =>
  axios.patch(`${API_BASE}/student/update/`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateOrganization = (payload: any, token: string) =>
  axios.patch(`${API_BASE}/organization/update/`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });