import { Middleware, MiddlewareAPI } from "redux";
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
    const jwtAuth = new JWTAuth({...defaultOptions, ...options});
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
