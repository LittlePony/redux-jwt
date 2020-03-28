import { Middleware, MiddlewareAPI, Dispatch } from "redux";
import JWTAuth from "./jwtAuth";
import { handleLogin, handleRefresh } from "./defaultHandler";
import { Action, Options } from "./types";
import * as actionTypes from "./actionTypes";

const defaultOptions = {
    onLogin: handleLogin,
    onRefresh: handleRefresh,
    isCached: true,
};

/**
 * Create a middleware.
 *
 * @returns {Middleware}
 */
export default (options: Options): Middleware => {
    const finalOptions = {...defaultOptions, ...options};
    const jwtAuth = new JWTAuth(finalOptions);

    const dispatchTable = {
        [actionTypes.JWT_LOGIN]: jwtAuth.login,
        [actionTypes.JWT_LOGOUT]: jwtAuth.logout,
        [actionTypes.JWT_LOAD]: jwtAuth.load,
    };
    return ({dispatch}: MiddlewareAPI) => next => (action: Action) => {
        const handler = Reflect.get(dispatchTable, action.type);
        handler && handler(dispatch, action);
        return next(action);
    };
};
