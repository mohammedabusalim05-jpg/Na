import api from "./api";

export const register = async (data) => {
    return await api.post("/accounts/register/", data);
};

export const login = async (data) => {
    const response = await api.post("/accounts/login/", data);

    // تخزين التوكنات
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response;
};
