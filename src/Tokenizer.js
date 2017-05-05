export function runProgram(src) {
  
}

// function exitNodeIsPossibleMove(node, dir, cc, src) {
//   const [X,Y] = node,
//         isWithinMap = X > -1 && Y > -1 && X < src[0].length Y < src.length,
//         nextNodeIsNotBlack = (x,y) => src[y][x].color !== '#000'

//   return isWithinMap && nextNodeIsNotBlack(X,Y)
// }

export function findExitNode(group, direction, codelChooser) {
  switch (direction) {
    case 0:
      return findRightExit(group, codelChooser)
    case 1:
      return findDownExit(group, codelChooser)
    case 2:
      return findLeftExit(group, codelChooser)
    case 3:
      return findUpExit(group, codelChooser)
    default:
      throw new Error(`${direction} is not a valid direction coordinate`)
  }
}

function findUpExit(group, codelChooser) {
  return group.reduce((a,b) => {
    const [ X,Y ] = b.split(':').map(n => +n)

    if (codelChooser === 0) {
      if (Y < a[1] || (Y === a[1] && X < a[0])) {
        return [X,Y]
      }
    } else {
      if (Y < a[1] || (Y === a[1] && X > a[0])) {
        return [X,Y]
      }
    }

    return a
  }, [ codelChooser !== 0 ? 0 : Number.MAX_VALUE, Number.MAX_VALUE])
}

function findDownExit(group, codelChooser) {
  return group.reduce((a,b) => {
    const [ X,Y ] = b.split(':').map(n => +n)

    if (codelChooser === 0) {
      if (Y > a[1] || (Y === a[1] && X > a[0])) {
        return [X,Y]
      }
    } else {
      if (Y > a[1] || (Y === a[1] && X < a[0])) {
        return [X,Y]
      }
    }

    return a
  }, [codelChooser === 0 ? 0 : Number.MAX_VALUE,0])
}

function findRightExit(group, codelChooser) {
  return group.reduce((a,b) => {
    const [ X,Y ] = b.split(':').map(n => +n)

    if (codelChooser > 0) {
      if (X > a[0] || (X === a[0] && Y > a[1])) {
        return [X,Y]
      }
    } else {
      if (X > a[0] || (X === a[0] && Y < a[1])) {
        return [X,Y]
      }
    }

    return a
  }, [0,codelChooser === 0 ? Number.MAX_VALUE : 0])
}

function findLeftExit(group, codelChooser) {
  return group.reduce((a,b) => {
    const [ X,Y ] = b.split(':').map(n => +n)

    if (codelChooser > 0) {
      if (X < a[0] || (X === a[0] && Y < a[1])) {
        return [X,Y]
      }
    } else {
      if (X < a[0] || (X === a[0] && Y > a[1])) {
        return [X,Y]
      }
    }

    return a
  }, [Number.MAX_VALUE, codelChooser !== 0 ? Number.MAX_VALUE : 0])
}

export function gatherColorGroup(_x, _y, src) {
    const VISITED        = [],
          QUEUE          = [ [_y,_x] ],
          COLOR          = src[_x][_y].color,
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