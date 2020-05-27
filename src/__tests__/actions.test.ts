import * as actions from "../actions";
import { Credentials } from "../types";
import { JWT_ERROR, JWT_LOAD, JWT_LOGIN, JWT_LOGOUT, JWT_UPDATE } from "../actionTypes";


describe("Test action creators", () => {
    const credentials: Credentials = {username: "mockUsername", password: "mockPassword"};

    it("should return login action", () => {
        const action = actions.login(credentials);
        expect(action).toEqual({
            type: JWT_LOGIN,
            payload: credentials,
        });
    });

    it("should return logout action", () => {
        const action = actions.logout();
        expect(action).toEqual({
            type: JWT_LOGOUT,
        });
    });

    it("should return error action", () => {
        const err = new Error();
        const action = actions.error(err);
        expect(action).toEqual({
            type: JWT_ERROR,
            payload: err,
            error: true,
        });
    });

    it("should return load action", () => {
        const action = actions.load();
        expect(action).toEqual({
            type: JWT_LOAD,
        });
    });

    it("should return update action", () => {
        const token = {access: "mockAccessToken"};
        const action = actions.update(token);
        expect(action).toEqual({
            type: JWT_UPDATE,
            payload: "mockAccessToken",
        });
    });
});
