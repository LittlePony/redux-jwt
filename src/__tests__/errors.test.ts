import * as errors from "../errors";

describe("test errors", () => {
    it("should throw InvalidToken", () => {
        const errorFunc = () => {
            throw new errors.InvalidToken();
        };
        expect(errorFunc).toThrow(errors.InvalidToken);
    });

    it("should throw StorageError", () => {
        const errorFunc = () => {
            throw new errors.StorageError();
        };
        expect(errorFunc).toThrow(errors.StorageError);
    });

    it("should throw InvalidAccessToken", () => {
        const errorFunc = () => {
            throw new errors.InvalidAccessToken();
        };
        expect(errorFunc).toThrow(errors.InvalidAccessToken);
    });

    it("should throw StorageUndefined", () => {
        const errorFunc = () => {
            throw new errors.StorageUndefined();
        };
        expect(errorFunc).toThrow(errors.StorageUndefined);
    });
});
