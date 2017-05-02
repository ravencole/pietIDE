export const compose = (fns, init) => {
    return fns.reduce((a,b) => {
        return b(a)
    }, init)
}