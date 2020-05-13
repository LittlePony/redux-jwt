/* eslint max-classes-per-file: "off" */

export class InvalidAccessToken extends Error {
    constructor() {
        super();
        this.message = "Invalid access token";
        this.name = "InvalidAccessTokenError";
    }
}

export class StorageUndefined extends Error {
    constructor() {
        super();
        this.message = "Storage undefined";
        this.name = "StorageUndefinedError";
    }
}

export class StorageError extends Error {
    constructor() {
        super();
        this.message = "Storage error";
        this.name = "StorageError";
    }
}

export class InvalidToken extends Error {
    constructor() {
        super();
        this.message = "Invalid token";
        this.name = "InvalidTokenError";
    }
}
