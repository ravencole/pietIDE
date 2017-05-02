export const tokenizeColors = source => {
    const COLOR_GROUP = gatherColorGroup(0, 0, source),
          [ X,Y ]     = COLOR_GROUP[COLOR_GROUP.length - 1].split(':')

    return [{
        color: source[0][0].color,
        size: COLOR_GROUP.length,
        exitNode: [ +X,  +Y ],
        nextNode: [ +X+1,+Y ]
    }]
}


function gatherColorGroup(_x, _y, src) {
    const VISITED        = [],
          QUEUE          = [ [_x,_y] ],
          COLOR          = src[_y][_x].color,
          isPossibleMove = (x,y) => 
            x < src[0].length - 1 && 
            y < src.length - 1 &&  
            x > -1 &&
            y > -1,
          hasNotBeenVisited = (x,y) => !VISITED.includes(`${x}:${y}`),
          isCorrectColor    = (x,y) => src[y][x].color === COLOR,
          isValidMove       = (x,y) => 
            isPossibleMove(x,y) && 
            hasNotBeenVisited(x,y) && 
            isCorrectColor(x,y)


    while(QUEUE.length) {
        const [ X,Y ] = QUEUE.shift(),
              UP      = [ X,  Y+1 ],
              DOWN    = [ X,  Y-1 ],
              LEFT    = [ X-1,Y   ],
              RIGHT   = [ X+1,Y   ],
              MOVES   = [ UP,DOWN,LEFT,RIGHT ],
              ID      = `${X}:${Y}`

        if (VISITED.includes(ID)) {
            continue
        }

        VISITED.push(ID)

        MOVES.map(move => {
            if (isValidMove( ...move )) {
                QUEUE.push(move)
            }
        })
    }

    return VISITED
}