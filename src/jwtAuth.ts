import { Dispatch } from "redux";
import { Action, Token, AccessToken, DecodedToken, Options, RefreshToken } from "./types";
import { update, error } from "./actions";
import * as errors from "./errors";

export default class JWTAuth {
    private refreshToken: string | undefined;

    // middleware options
    private readonly options: Options;

    // time between refresh start and token expires
    private readonly aheadTime: number;

    // refresh timer id
    private scheduler: number | undefined;

    constructor(options: Options) {
        this.refreshToken = undefined;
        this.options = options;
        this.aheadTime = 5000;
        this.scheduler = undefined;
    }

    /**
     * Time after which the token must be updated, ms
     * @param token
     */
    private getTimespan = (token: string | undefined) => {
        if (token) {
            const tokenLifetime = (decoded: DecodedToken) => decoded.exp * 1000 - Date.now();
            const timespan = tokenLifetime(this.parseJwt(token)) - this.aheadTime;
            return timespan > 0 ? timespan : 0;
        }
        throw new errors.InvalidAccessToken();
    };

    /**
     * Success login handler
     * @param dispatch
     * @param token
     */
    private handleLogon = (dispatch: Dispatch, token: Token) => {
        this.options.onObtain && this.options.onObtain({access: token.access} as AccessToken);
        this.refreshToken = token.refresh;
        dispatch(update(token));
        this.options.isCached && this.save(token);
        this.scheduleRefresh(dispatch, token);
    };

    /**
     * Invoke callback onRefresh
     * @param dispatch
     */
    private refresh = (dispatch: Dispatch) =>
        this.options.onRefresh({refresh: this.refreshToken} as RefreshToken)
            .then((token: AccessToken) => {
                dispatch(update(token));
                this.options.isCached && this.save({access: token.access});
                return this.scheduleRefresh(dispatch, token);
            })
            .catch((err: Error) => dispatch(error(err)));

    /**
     * Schedule next refresh
     * @param dispatch
     * @param token
     */
    private scheduleRefresh = (dispatch: Dispatch, token: Token) => {
        const refreshTimespan = this.getTimespan(token.access);
        this.scheduler && clearTimeout(this.scheduler);
        this.scheduler = window.setTimeout(() => this.refresh(dispatch), refreshTimespan);
    };

    /**
     * JWT_LOGIN action handler
     * @param dispatch
     * @param action
     */
    public login = (dispatch: Dispatch, action: Action) =>
        this.options.onLogin(action.payload)
            .then((token: Token) => this.handleLogon(dispatch, token))
            .catch((err: Error) => dispatch(error(err)));

    /**
     * JWT_LOGOUT action handler
     * Stop timer and clear token
     * @param dispatch
     * @param action
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public logout = (dispatch: Dispatch, action: Action) => {
        this.refreshToken = undefined;
        this.scheduler && clearTimeout(this.scheduler);
        this.scheduler = undefined;
        const {storage} = this.options;
        storage.setItem("jwt.refresh", "");
        storage.setItem("jwt.access", "");
    };

    /**
     * JWT_LOAD action handler
     * Setup cached tokens
     * @param dispatch
     */
    public load = (dispatch: Dispatch) => {
        const {storage} = this.options;
        if (!storage) {
            throw new errors.StorageUndefined();
        }
        const refresh = storage.getItem("jwt.refresh") || undefined;
        const isRefreshValid = this.isTokenValid(refresh);
        if (isRefreshValid) {
            this.refreshToken = refresh;
        }
        const access = storage.getItem("jwt.access") || undefined;
        const isAccessValid = this.isTokenValid(access);
        if (isAccessValid) {
            dispatch(update({ access }));
        }
        if (isRefreshValid && isAccessValid && this.getTimespan(access) > this.aheadTime) {
            this.scheduleRefresh(dispatch, { access });
        } else if (isRefreshValid) {
            this.refresh(dispatch);
        }
    };

    /**
     * Save token
     * @param token
     */
    public save = (token: Token) => {
        const {storage} = this.options;

        if (!storage) {
            throw new errors.StorageUndefined();
        }
        if (!token.access) {
            throw new errors.InvalidAccessToken();
        }
        try {
            storage.setItem("jwt.access", token.access);
            token.refresh && storage.setItem("jwt.refresh", token.refresh);
        } catch {
            throw new errors.StorageError();
        }
    };

    /**
     * Parse base64 encoded token
     * @param token
     * @returns {object}
     */
    private parseJwt = (token: string): DecodedToken => {
        if (!token) {
            throw new errors.InvalidToken();
        }
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url
                .replace("-", "+")
                .replace("_", "/");
            return JSON.parse(window.atob(base64));
        } catch {
            throw new errors.InvalidToken();
        }
    };

    /**
     * Do we have a valid token
     * @param token
     */
    private isTokenValid = (token: string | undefined) => {
        if (!token) {
            return false;
        }
        try {
            if (this.getTimespan(token) > 0) {
                return true;
            }
            // eslint-disable-next-line no-empty
        } catch {}
        return false;
    };
}
