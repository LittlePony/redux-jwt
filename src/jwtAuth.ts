import { Dispatch } from "redux";
import { Action, Token, AccessToken, DecodedToken, Options } from "./types";
import { JWT_UPDATE, JWT_ERROR, JWT_EXIT } from "./actionTypes";

export default class JWTAuth {
    private refreshToken: string | undefined;

    private options: Options;

    private aheadTime: number;

    private scheduler: number | undefined;

    constructor(options: Options) {
        this.refreshToken = undefined;
        this.options = options;
        this.aheadTime = 5000;
        this.scheduler = undefined;
    }

    private accessLifetime = (access: DecodedToken) => (access.exp * 1000 - Date.now());

    private getTimespan = (token: Token) => {
        if (token.access) {
            return this.accessLifetime(this.parseJwt(token.access)) - this.aheadTime
        }
        throw new Error("Invalid access token")
    };

    private handleLogon = (dispatch: Dispatch, token: Token) => {
        this.refreshToken = token.refresh;

        dispatch({
            type: JWT_UPDATE,
            payload: token.access,
        });
        this.scheduleRefresh(dispatch, token);
    };

    private refresh = (dispatch: Dispatch) => {
        this.options.onRefresh({refresh: this.refreshToken || ""})
            .then((token: AccessToken) => {

                dispatch({
                    type: JWT_UPDATE,
                    payload: token.access,
                });
                this.scheduleRefresh(dispatch, token);
            })
            .catch((error: Error) => dispatch(this.error(error)))
    };

    /**
     * Schedule next refresh
     * @param dispatch
     * @param token
     */
    private scheduleRefresh = (dispatch: Dispatch, token: Token) => {
        const refreshTimespan = this.getTimespan(token);
        this.scheduler = window.setTimeout(() => this.refresh(dispatch), refreshTimespan);
    };

    /**
     * Error action creator
     * @param error
     */
    private error = (error: Error) => ({
            type: JWT_ERROR,
            payload: error,
            error: true,
    });

    public login = (dispatch: Dispatch, action: Action) => {
        this.options.onLogin(action.payload)
            .then((token: Token) => this.handleLogon(dispatch, token))
            .catch((error: Error) => dispatch(this.error(error)))
    };

    /**
     * Stop timer and clear token
     * @param dispatch
     * @param action
     */
    public logout = (dispatch: Dispatch, action: Action) => {
        this.refreshToken = undefined;
        this.scheduler && clearTimeout(this.scheduler);
        dispatch({type: JWT_EXIT})
    };

    /**
     * Parse base64 encoded token
     * @param token
     * @returns {object}
     */
    private parseJwt(token: string): DecodedToken {
        const base64Url = token.split(".")[1];
        const base64 = base64Url
            .replace("-", "+")
            .replace("_", "/");
        return JSON.parse(window.atob(base64));
    }
}
