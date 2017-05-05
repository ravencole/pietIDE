export default class Interpreter {
    constructor(src) {
        this.src            = src
        this.height         = src.length
        this.width          = src.width
        this.dp             = 0
        this.cc             = 0
        this.stack          = []
        this.currentStep    = 0
        this.finished       = false
        this.attemptedMoves = 0
        this.queue          = []
    }
    findDownExitNode(pixelGroup) {
        return pixelGroup.reduce((a,b) => {
            const [ X,Y ] = b.split(':').map(n => +n)

            if (this.cc === 0) {
                if (Y > a[1] || (Y === a[1] && X > a[0])) {
                    return [ X,Y ]
                }
            } else {
                if (Y > a[1] || (Y === a[1] && X < a[0])) {
                    return [ X,Y ]
                }
            }

            return a
        }, [ this.cc === 0 ? 0 : Number.MAX_VALUE,0 ])
    }
    findExitNode(pixelGroup) {
        switch(this.dp) {
            case 0:
                return this.findLeftExitNode(pixelGroup)
            case 1:
                return this.findDownExitNode(pixelGroup)
            case 2:
                return this.findRightExitNode(pixelGroup)
            case 3:
                return this.findUpExitNode(pixelGroup)
        }
    }
    findLeftExitNode(pixelGroup) {
        return pixelGroup.reduce((a,b) => {
            const [ X,Y ] = b.split(':').map(n => +n)

            if (this.cc === 0) {
                if (X > a[0] || (X === a[0] && Y < a[1])) {
                    return [ X,Y ]
                }
            } else {
                if (X > a[0] || (X === a[0] && Y > a[1])) {
                    return [ X,Y ]
                }
            }

            return a
        }, [0, this.cc === 0 ? Number.MAX_VALUE : 0])
    }
    findRightExitNode(pixelGroup) {
        return pixelGroup.reduce((a,b) => {
            const [ X,Y ] = b.split(':').map(n => +n)

            if (this.cc === 0) {
                if (X < a[0] || (X === a[0] && Y > a[1])) {
                    return [ X,Y ]
                }
            } else {
                if (X < a[0] || (X === a[0] && Y < a[1])) {
                    return [ X,Y ]
                }
            }

            return a
        }, [ Number.MAX_VALUE, this.cc === 0 ? 0 : Number.MAX_VALUE])
    }
    findUpExitNode(pixelGroup) {
        return pixelGroup.reduce((a,b) => {
            const [ X,Y ] = b.split(':').map(n => +n)

            if (this.cc === 0) {
                if (Y < a[1] || (Y === a[1] && X < a[0])) {
                    return [ X,Y ]
                }
            } else {
                if (Y < a[1] || (Y === a[1] && X > a[0])) {
                    return [ X,Y ]
                }
            }

            return a
        }, [ this.cc === 0 ? Number.MAX_VALUE : 0,  Number.MAX_VALUE ])
    }
    getColorGroup(_x,_y) {
        const VISITED        = [],
              QUEUE          = [ [_y,_x] ],
              COLOR          = this.src[_x][_y].color,
              isPossibleMove = (x,y) => 
                  x < this.src[0].length && 
                  y < this.src.length &&  
                  x > -1 &&
                  y > -1,
              hasNotBeenVisited = (x,y) => !VISITED.includes(`${x}:${y}`),
              isCorrectColor    = (x,y) => this.src[y][x].color === COLOR,
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
    run() {
        this.queue.push([0,0])

        while(this.queue.length) {
            const [ X,Y ] = this.queue.shift(),
                  PIXEL_GROUP = this.getColorGroup(X,Y),
                  EXIT_NODE = this.findExitNode(PIXEL_GROUP)
        }
    }
}