import axios from "axios";

const API_BASE = "/api";

// ========================================================
//   AXIOS INSTANCE
// ========================================================
const api = axios.create({
    baseURL: API_BASE,
});

// ========================================================
//   ADD ACCESS TOKEN TO ALL REQUESTS AUTOMATICALLY
// ========================================================
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ========================================================
//   AUTO REFRESH TOKEN WHEN ACCESS TOKEN EXPIRES
// ========================================================
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Token expired → refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem("refresh_token");

                const res = await axios.post(`${API_BASE}/accounts/refresh/`, {
                    refresh,
                });

                // Store new token
                localStorage.setItem("access_token", res.data.access);

                // Apply token to axios
                api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

                // Retry original request
                return api(originalRequest);
            } catch (err) {
                // Refresh token expired → logout
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// ========================================================
//   AUTH APIS
// ========================================================
export const loginApi = (email, password) =>
    api.post("/accounts/login/", { email, password });

export const registerApi = (data) =>
    api.post("/accounts/register/", data);

export const getProfileApi = () =>
    api.get("/accounts/profile/");

export const updateProfileApi = (data) =>
    api.put("/accounts/profile/update/", data);

// ========================================================
//   DONATION APIs
// ========================================================

// ✔ Create donation (supports JSON and images via FormData)
export const createDonationApi = (data) => {
    const isFormData = data instanceof FormData;

    return api.post(
        "/donations/create/",
        data,
        isFormData
            ? {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              }
            : undefined
    );
};

// ✔ Get all donations
export const getDonationsApi = () =>
    api.get("/donations/");

// ✔ Get donations by type
export const getDonationByTypeApi = (type) =>
    api.get(`/donations/${type}/`);

// ✔ Get single donation by ID
export const getDonationByIdApi = (id) =>
    api.get(`/donations/${id}/`);

// NGO employee views donations assigned to their NGO
export const getNgoAssignedDonationsApi = () =>
    api.get("/donations/ngo/my/");

// Users view NGOs linked to a donation category
export const getNgosByDonationCategoryApi = (type) =>
    api.get(`/donations/categories/${type}/ngos/`);

// NGO employee views supported donation categories
export const getNgoSupportedCategoriesApi = () =>
    api.get("/donations/ngo/supported-categories/");

// NGO employee updates supported donation categories
export const updateNgoSupportedCategoriesApi = (donationTypes) =>
    api.patch("/donations/ngo/supported-categories/", {
        donation_types: donationTypes,
    });
// ========================================================
//   AID REQUEST / CASE APIs
// ========================================================

// Beneficiary creates a new aid request
export const createAidRequestApi = (data) =>
    api.post("/cases/create/", data);

// Beneficiary views their own aid requests
export const getMyAidRequestsApi = () =>
    api.get("/cases/my/");

// Users view approved aid requests
export const getApprovedAidRequestsApi = () =>
    api.get("/cases/");

// Users view one public approved aid request
export const getAidRequestByIdApi = (id) =>
    api.get(`/cases/${id}/`);

// Admin views all aid requests
export const getAllAidRequestsAdminApi = () =>
    api.get("/cases/admin/all/");

// Admin updates aid request status
export const updateAidRequestStatusApi = (id, data) =>
    api.patch(`/cases/admin/${id}/status/`, data);

// Admin deletes aid request
export const deleteAidRequestAdminApi = (id) =>
    api.delete(`/cases/admin/${id}/delete/`);

// NGO employee views cases waiting for NGO approval
export const getNgoPendingAidRequestsApi = () =>
    api.get("/cases/ngo/pending/");

// NGO employee views cases they accepted
export const getNgoMyCasesApi = () =>
    api.get("/cases/ngo/my-cases/");

// NGO employee approves or rejects a case
export const updateNgoAidRequestStatusApi = (id, data) =>
    api.patch(`/cases/ngo/${id}/status/`, data);

export default api;
