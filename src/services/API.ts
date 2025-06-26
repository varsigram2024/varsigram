import axios from "axios";

const API_BASE = "https://api.varsigram.com/api/v1";

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

export const updateStudent = async (data: any, token: string) => {
  return axios.put(`${API_BASE}/student/update/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateOrganization = async (data: any, token: string) => {
  return axios.put(`${API_BASE}/organization/update/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};