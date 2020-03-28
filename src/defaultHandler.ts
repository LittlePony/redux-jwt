import { Credentials, RefreshToken } from "./types";

const refreshURL = "/api/auth/token/refresh/";
const obtainURL = "/api/auth/token/obtain/";

const handleResponse = (response: Response) => {
    if(response.ok) {
        return response.json();
    }
    throw new Error(response.statusText)
};

export const handleLogin = (credentials: Credentials) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials),
    };
    return fetch(obtainURL, fetchOptions)
        .then(handleResponse)
};

export const handleRefresh = (token: RefreshToken) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(token),
    };
    return fetch(refreshURL, fetchOptions)
        .then(handleResponse)
};
