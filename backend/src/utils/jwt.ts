import jwt from 'jsonwebtoken';

export const signJwt = (
    object: Object,
    keyName: 'JWT_SECRET' | 'JWT_REFRESH_SECRET',
    options?: jwt.SignOptions | undefined
) => {
    const signingKey = process.env[keyName] as string;
    return jwt.sign(object, signingKey, {
        ...(options && options),
    });
};

export const verifyJwt = <T>(
    token: string,
    keyName: 'JWT_SECRET' | 'JWT_REFRESH_SECRET'
): T | null => {
    try {
        const signingKey = process.env[keyName] as string;
        return jwt.verify(token, signingKey) as T;
    } catch (e) {
        return null;
    }
};
