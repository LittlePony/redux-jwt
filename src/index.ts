import createMiddleware from "./middleware";
export * from "./actionTypes";
import { login, logout, load } from "./actions";

export {
    login,
    logout,
    load,
    createMiddleware as default
}
