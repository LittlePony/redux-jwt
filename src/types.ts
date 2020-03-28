import { JWT_LOGIN, JWT_LOGOUT, JWT_UPDATE, JWT_ERROR } from './actionTypes';

export type Action =
| { type: typeof JWT_LOGIN, payload: any }
| { type: typeof JWT_LOGOUT, payload: any }
| { type: typeof JWT_UPDATE, payload: any }
| { type: typeof JWT_ERROR, payload: any, error: Error }

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

export type Options = {
    onLogin: (credentials: Credentials) => any,
    onRefresh: (token: RefreshToken) => any,
    refreshInterval?: number,
    isCached: boolean,
    storage: Storage,
}

export interface DecodedToken {
    exp: number,
}


