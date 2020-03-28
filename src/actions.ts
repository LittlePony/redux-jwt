import { Token, Credentials } from "./types";
import { JWT_UPDATE, JWT_LOGIN, JWT_ERROR, JWT_LOGOUT, JWT_LOAD } from "./actionTypes";

/**
 * User dispatched
 * @param credentials
 */
export const login = (credentials: Credentials) => ({
    type: JWT_LOGIN,
    payload: credentials
});

/**
 * User dispatched
 */
export const logout = () => ({
    type: JWT_LOGOUT,
});

/**
 * User dispatched
 */
export const load = () => ({
    type: JWT_LOAD,
});

/**
 * Middleware dispatched
 * @param token
 */
export const update = (token: Token) => ({
    type: JWT_UPDATE,
    payload: token.access,
});

/**
 * Middleware dispatched
 * @param error
 */
export const error = (error: Error) => ({
    type: JWT_ERROR,
    payload: error,
    error: true,
});
