import { COLORS, COLORS_BY_SHORTCUT } from '../src/components/constants'

const defaultCodelObj = (i, j, color) => {
    return {
        color: color || '#FFF',
        loc: {
            x: j,
            y: i
        }
    }
}

export const mockSource = (height, width, src) => {
    if (!src) {
        return [...Array(height)].map((row, i) => {
            return [...Array(width)].map((col, j) => {
                return {
                    color: '#FFF',
                    x: j,
                    y: i
                }
            })
        })
    }
    
    const NEW_SRC = src.concat([...Array(height - src.length)].map(_ => [...Array(width)]))

    return NEW_SRC.map((row,i) => {
        while (row.length < width) {
            row.push(undefined)
        }

        return row.map((tile,j) => {
            const color = tile && COLORS_BY_SHORTCUT.hasOwnProperty(tile) ?
                            COLORS[COLORS_BY_SHORTCUT[tile]] :
                            '#FFF'

            return {
                color,
                x: j,
                y: i
            }
        })
    })
}