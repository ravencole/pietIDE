export function compose(fns, init) {
  if (arguments.length < 2)
    throw new Error('not enough arguments provided to the compose function')
  
  return fns.reduce((a,b) => {
      return b(a)
  }, init)
}

export const gatherColorGroup = (_y,_x,src) => {
    const VISITED        = [],
          QUEUE          = [ [_x,_y] ],
          COLOR          = src[_y][_x].color,
          isPossibleMove = (x,y) => 
              x < src[0].length && 
              y < src.length &&  
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