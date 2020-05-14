import { Credentials } from "../types";

const onLogin = (credentials: Credentials) => {
    const token = ({access: "mockAccessToken", refresh: "mockRefreshToken"});

    return new Promise<any>((resolve, reject) => {
        if (credentials.username === "mockUsername" && credentials.password === "mockPassword") {
            resolve(token);
        } else {
            reject(new Error());
        }
    });
};

export default onLogin;
