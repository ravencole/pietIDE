const defaultCodelObj = (i,j) => {
    return {
        color: '#FFF',
        loc: {
            x: j,
            y: i
        }
    }
}

export const mockSource = (height, width, srcStarter) => {
    if (!srcStarter) {
        return [...Array(height)].map((_,i) => {
            return [...Array(width)].map((_,j) => {
                return defaultCodelObj(i,j)
            })
        })
    }

    const newSrc = srcStarter.concat([...Array(height - srcStarter.length)]).map((row,i) => {
        if (!row) {
            row = [...Array(width)]
        } else if (row.length < width) {
            row = row.concat([...Array(width - row.length)])
        }

        return row.map((col,j) => {
            if (col) return col
            return defaultCodelObj(i,j)
        })
    })

    return newSrc
}