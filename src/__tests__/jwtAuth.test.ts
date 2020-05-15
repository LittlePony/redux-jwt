import JWTAuth from "../jwtAuth";
import { Action, Credentials, Token } from "../types";
import * as actionTypes from "../actionTypes";
import * as errors from "../errors";


const handleLoginMock = (credentials: Credentials) => {
    const token = ({access: "mockAccessToken", refresh: "mockRefreshToken"});

    return new Promise<any>((resolve, reject) => {
        if (credentials.username === "mockUsername" && credentials.password === "mockPassword") {
            resolve(token);
        } else {
            reject(new Error());
        }
    });
};

const handleRefreshMock = (token: Token) => {
    // const token = ({access: "mockAccessToken", refresh: "mockRefreshToken"});
    const accessToken = ({access: "mockAccessToken"});

    return new Promise<any>((resolve, reject) => {
        if (token?.refresh === "mockRefreshToken") {
            resolve(accessToken);
        } else {
            reject(new Error());
        }
    });
};

describe("ReduxWsJsonRpc", () => {
    const invalidToken = "invalidToken";
    const emptyToken = "";
    const undefinedToken = undefined;
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiI5MTUxMzgwMDAiLCJuYW1lIjoiSm9obiBEb2UiLC"
        + "JpZCI6MX0.Q0qYZFVBVqjW0jvMzlGskZDqHfGlVGyFA4BiRqLPypE"; // 1999.01.01
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiI0MDcwODk4MDAwIiwibmFtZSI6IkpvaG4gRG9lIiwia"
        + "WQiOjF9.nSQav6vAgPL7vf1SUNa317kVjjZRaCxtxVan9W8bbjA"; // 2099.01.01
    const store = {
        dispatch: jest.fn((i: any) => i),
        getState: () => {
        },
    };
    const options = {
        onLogin: handleLoginMock,
        onRefresh: handleRefreshMock,
        refreshInterval: 5000,
        isCached: true,
        storage: window.localStorage,
    };
    let jwtAuth: JWTAuth;

    jwtAuth = new JWTAuth(options);

    beforeEach(() => {
        // jwtAuth = new JWTAuth(options);
        store.dispatch.mockClear();
    });

    describe("login", () => {
        const credentials: Credentials = {username: "mockUsername", password: "mockPassword"};
        const action: Action = {type: actionTypes.JWT_LOGIN, payload: credentials};

        it("onLogin callback invoked with credentials", () => {
            // @ts-ignore
            const spyOnLogin = jest.spyOn(jwtAuth.options, "onLogin");

            jwtAuth.login(store.dispatch, action);
            expect(spyOnLogin).toHaveBeenCalledTimes(1);
            expect(spyOnLogin).toHaveBeenCalledWith(credentials);
        });
    });

    describe("refresh", () => {
        it("onRefresh callback invoked with token", () => {
            // @ts-ignore
            const spyOnRefresh = jest.spyOn(jwtAuth.options, "onRefresh");
            // @ts-ignore
            jwtAuth.refresh(store.dispatch);
            expect(spyOnRefresh).toHaveBeenCalledTimes(1);
            expect(spyOnRefresh).toHaveBeenCalledWith({refresh: "mockRefreshToken"});
        });

        it("refresh callback returned token", async () => {
            // @ts-ignore
            const spySave = jest.spyOn(jwtAuth, "save")
                .mockImplementationOnce(() => true);
            // @ts-ignore
            const spyScheduleRefresh = jest.spyOn(jwtAuth, "scheduleRefresh")
                // @ts-ignore
                .mockImplementationOnce((a, b) => b);

            expect.assertions(2);
            // @ts-ignore
            await jwtAuth.refresh(store.dispatch);
            expect(spySave).toHaveBeenCalledTimes(1);
            // @ts-ignore
            expect(spyScheduleRefresh).toHaveBeenCalledWith(expect.anything(), {access: "mockAccessToken"});
        });
    });

    describe("tokens", () => {
        it("isTokenValid", () => {
            // @ts-ignore
            const {isTokenValid} = jwtAuth;

            expect(isTokenValid(undefinedToken)).toBe(false);
            expect(isTokenValid(invalidToken)).toBe(false);
            expect(isTokenValid(emptyToken)).toBe(false);
            expect(isTokenValid(expiredToken)).toBe(false);
            expect(isTokenValid(validToken)).toBe(true);
        });

        it("parseJwt", () => {
            // @ts-ignore
            const {parseJwt} = jwtAuth;
            // @ts-ignore
            expect(() => parseJwt(undefinedToken)).toThrow(errors.InvalidToken);
            expect(() => parseJwt(invalidToken)).toThrow(errors.InvalidToken);
            expect(() => parseJwt(emptyToken)).toThrow(errors.InvalidToken);
            expect(parseJwt(expiredToken).exp).toEqual((new Date("1999.01.01").getTime() / 1000).toString());
            expect(parseJwt(validToken).exp).toEqual((new Date("2099.01.01").getTime() / 1000).toString());
        });

        it("getTimespan", () => {
            // @ts-ignore
            const {getTimespan} = jwtAuth;
            // @ts-ignore
            expect(() => getTimespan(undefinedToken)).toThrow(errors.InvalidAccessToken);
            expect(() => getTimespan(invalidToken)).toThrow(errors.InvalidToken);
            expect(() => getTimespan(emptyToken)).toThrow(errors.InvalidAccessToken);
            expect(getTimespan(expiredToken)).toBe(0);

            jest.spyOn(global.Date, "now")
                .mockImplementationOnce(() => new Date("2019.01.01").getTime());
            // @ts-ignore
            expect(getTimespan(validToken)).toEqual(2524608000000 - jwtAuth.aheadTime);
        });

        it("save", () => {
            const spySetItem = jest.spyOn(Storage.prototype, "setItem");

            jwtAuth.save({access: validToken});
            expect(spySetItem).toBeCalled();
            expect(spySetItem).toBeCalledWith("jwt.access", validToken);
        });

        it("load", () => {
            const spyGetItem = jest.spyOn(Storage.prototype, "getItem");

            jwtAuth.load(store.dispatch);
            expect(spyGetItem).toBeCalledTimes(2);
            expect(spyGetItem).toBeCalledWith("jwt.access");
            expect(spyGetItem).toReturnWith(validToken);

            expect(spyGetItem).toBeCalledWith("jwt.refresh");
            expect(spyGetItem).toReturnWith("mockRefreshToken");
        });

        it("load() should throw Error with uncongigured storage", () => {
            // @ts-ignore
            jwtAuth = new JWTAuth({...options, storage: undefined});
            expect(() => jwtAuth.load(store.dispatch)).toThrow(errors.StorageUndefined);
        });
    });
});
