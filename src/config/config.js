const accessTokenCookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 3 * 60 * 60 * 1000,
}

const refreshTokenCookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
}

export { accessTokenCookieConfig, refreshTokenCookieConfig }
