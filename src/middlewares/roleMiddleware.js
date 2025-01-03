import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            throw new UnauthenticatedError('You need to login first')
        }

        const userRole = req.user.role

        if (!roles.includes(userRole)) {
            throw new UnauthorizedError(
                "You don't have the permission for access"
            )
        }
        next()
    }
}

export { authorize }
