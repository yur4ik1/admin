export const getRoute = (route) => {
    const isProd = import.meta.env.PROD
    const adminRoute = '/admin'

    if (isProd) {
        return `${adminRoute}${route}`
    }
    return route
}