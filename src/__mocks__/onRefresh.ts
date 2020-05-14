import { Token } from "../types";

const onRefresh = (token: Token) => {
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

export default onRefresh;
