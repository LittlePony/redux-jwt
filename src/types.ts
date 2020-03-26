import { JWT_LOGIN, JWT_LOGOUT, JWT_UPDATE, JWT_ERROR, JWT_EXIT } from './actionTypes';

export type Action =
| { type: typeof JWT_LOGIN, payload: any }
| { type: typeof JWT_LOGOUT, payload: any }
| { type: typeof JWT_UPDATE, payload: any }
| { type: typeof JWT_ERROR, payload: any, error: Error }
| { type: typeof JWT_EXIT, payload: any }

export interface Credentials {
    username: string,
    password: string,
}

export interface Token {
    access?: string,
    refresh?: string,
}

export type AccessToken = {
    access: string
}

export type RefreshToken = {
    refresh: string
}

export interface Options  {
    onLogin: (credentials: Credentials) => any,
    onRefresh: (token: RefreshToken) => any,
    refreshInterval?: number,
}

export interface DecodedToken {
    exp: number,
}
