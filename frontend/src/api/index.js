import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

// ------- axios instance -------
const api = axios.create({
    baseURL: API_BASE,
});

// ------- Add access token to every request -------
api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ------- Auto refresh token -------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken =
                    localStorage.getItem("refresh_token") ||
                    localStorage.getItem("refresh");

                const res = await axios.post(
                    `${API_BASE}/accounts/refresh/`,
                    { refresh: refreshToken }
                );

                localStorage.setItem("access_token", res.data.access);
                localStorage.setItem("access", res.data.access);

                api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// ------------------------------------------------
// AUTH APIs
// ------------------------------------------------

export const loginApi = (email, password) =>
    api.post("/accounts/login/", { email, password });

export const guestApi = () =>
    api.post("/accounts/guest/");

export const registerApi = (data) =>
    api.post("/accounts/register/", data);

export const getProfileApi = () =>
    api.get("/accounts/profile/");

export const updateProfileApi = (data) =>
    api.patch("/accounts/profile/", data);

// ------------------------------------------------
// DONATIONS APIs
// ------------------------------------------------

export const createDonationApi = (data) =>
    api.post("/donations/create/", data);

export const getDonationsApi = () =>
    api.get("/donations/");

export const getDonationByTypeApi = (type) =>
    api.get(`/donations/type/${type}/`);

export const getDonationByIdApi = (id) =>
    api.get(`/donations/${id}/`);

// ------------------------------------------------
// DASHBOARD APIs  ✅ المهم
// ------------------------------------------------

export const getDonationsStats = () =>
    api.get("/donations/stats/");

export const getRequestsStats = () =>
    api.get("/donations/requests/stats/");

export const updateRequestStatus = (id, data) =>
    api.patch(`/donations/requests/${id}/update/`, data);

export const deleteRequest = (id) =>
    api.delete(`/donations/requests/${id}/delete/`);

// (اختياري) للملفات القديمة
export const getDashboardStats = getDonationsStats;

export default api;
