import { 
    COMMANDS, 
    COLORS_ARRAY_NO_BW,
    FLATTENED_COMMANDS,
    COLORS_BY_HEX
} from './components/constants'

const COMMANDS_ARR = COMMANDS.slice(0)

export default class Interpreter {
    constructor(src) {
        this.src             = src
        this.height          = src.length
        this.width           = src[0].length
        this.dp              = 0
        this.cc              = 0
        this.stack           = []
        this.currentStep     = 0
        this.finished        = false
        this.attemptedMoves  = 0
        this.queue           = []
        this.tmpRegister     = 0
        this.previousColor   = 'white'
        this.operationPoint  = [0,0]
        this.previousCommand = 'no op'
        this.waitingForIO    = false
        this.exitNode        = [0,0]
    }
    addOperation() {
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        this.stack.unshift( SECOND_NUM + FIRST_NUM )
    }
    alignColorArray(hue, lightness) {
        const COLORS_ARR = COLORS_ARRAY_NO_BW.slice(0)

        while(COLORS_ARR[0][0].hue !== hue) {
            const tmp = COLORS_ARR.shift()
            COLORS_ARR.push(tmp)
        }

        while(COLORS_ARR[0][0].lightness !== lightness) {
            COLORS_ARR.map(r => {
                const tmp = r.shift()
                r.push(tmp)
            })
        }

        return COLORS_ARR
    }
    commandDeliveredIOObligations(res) {
        return res !== null && 
               typeof res === 'object' && 
               (
                    res.hasOwnProperty('output') || 
                    (res.hasOwnProperty('prompt') && typeof res.prompt === 'function')
               )

    }
    divideOperation() {
        if (this.stack.length < 2)
            return
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        if (FIRST_NUM === 0 || SECOND_NUM === 0) {
            return
        }

        this.stack.unshift( Math.floor(SECOND_NUM / FIRST_NUM) )
    }
    duplicateOperation() {
        if (this.stack[0] !== undefined)
            this.stack.unshift(this.stack[0])
    }
    executeOperation(operation) {
        if (!this.operationIsValid(operation))
            throw new Error(`${operation} is not a valid operation`)

        const OP = operation.replace(/\(|\)/g, '')

        return this[`${OP}Operation`]()
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
        let dirFuc = this.findExitNodeFunc()

        const FIRST = this[dirFuc](pixelGroup)

        this.cc = (this.cc + 1) % 2

        const SECOND = this[this.findExitNodeFunc()](pixelGroup)

        this.cc = (this.cc + 1) % 2

        if (this.hasBlackTileInNextMove(FIRST) && this.hasColoredTileInNextMove(SECOND)) {
            return SECOND
        }

        if (this.hasBlackTileInNextMove(FIRST) || this.hasColoredTileInDirection(FIRST)) {
            return FIRST
        } else if (this.hasColoredTileInDirection(SECOND)) {
            this.cc = (this.cc + 1) % 2
            return SECOND
        }

        return FIRST
    }
    findExitNodeFunc() {
        switch(this.dp) {
            case 0:
                return 'findLeftExitNode'
            case 1:
                return 'findDownExitNode'
            case 2:
                return 'findRightExitNode'
            case 3:
                return 'findUpExitNode'
            default:
                throw new Error(`${this.dp}`)
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
        if (this.src[_y][_x].color === '#FFF')
            return [`${_x}:${_y}`]

        const VISITED        = [],
              QUEUE          = [ [_x,_y] ],
              COLOR          = this.src[_y][_x].color,
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
    getCommandFromColor(currentColor, nextColor) {
        if (currentColor === 'white') {
            return 'no op'
        }

        if (!nextColor) {
            throw new Error('nextColor is undefined')
        }

        const CURRENT_HUE       = this.getHueFromColorName(currentColor),
              CURRENT_LIGHTNESS = this.getLightnessFromColorName(currentColor),
              NEXT_HUE          = this.getHueFromColorName(nextColor),
              NEXT_LIGHTNESS    = this.getLightnessFromColorName(nextColor),
              COLORS_ARR        = this.alignColorArray(CURRENT_HUE, CURRENT_LIGHTNESS)

        return COLORS_ARR.reduce((a,b,i) => {
            b.map((c,j) => {
                if (c.hue === NEXT_HUE && c.lightness === NEXT_LIGHTNESS) {
                    a = COMMANDS_ARR[i][j]
                }
            })
            return a
        }, '')
    }
    getHueFromColorName(color) {
        if (!color)
            throw new Error([
                `\ngetHueFromColorName was called without a valid color:',
                '              color: ${color}',
                'color === undefined: ${color === undefined}`
            ].join("\n"))

        return color.replace(/^(mid|light|dark)([\w]+)$/g, `$2`).toLowerCase()
    }
    getLightnessFromColorName(color) {
        const LIGHTNESS = /(light|mid|dark)/.exec(color)
        return LIGHTNESS ? LIGHTNESS[0] : false
    }
    getNextOperationPoint(exitNode,pixelGroup) {
        if (this.attemptedMoves >= 8) {
            this.finished = true
            return null
        }

        const [ X,Y ] = exitNode

        if (this.dp === 0) {
            if ( X+1 < this.src[0].length && this.src[Y][X+1].color !== '#000') {
                this.attemptedMoves = 0
                return [ X+1,Y ]
            }
        } else if (this.dp === 1) {
            if ( Y+1 < this.src.length && this.src[Y+1][X].color !== '#000') {
                this.attemptedMoves = 0
                return [ X,Y+1 ]
            }
        } else if (this.dp === 2) {
            if ( X-1 > -1 && this.src[Y][X-1].color !== '#000') {
                this.attemptedMoves = 0
                return [ X-1,Y ]
            }
        } else {
            if ( Y-1 > -1 && this.src[Y-1][X].color !== '#000') {
                this.attemptedMoves = 0
                return [ X,Y-1 ]
            }
        }

        if (this.attemptedMoves % 2 === 0) {
            this.dp = (this.dp + 1) % 4
        } else {
            this.cc = (this.cc + 1) % 2
        }

        this.attemptedMoves++

        return this.getNextOperationPoint(this.findExitNode(pixelGroup), pixelGroup)
    }
    greaterOperation() {
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        if (SECOND_NUM > FIRST_NUM) {
            this.stack.unshift(1)
        } else {
            this.stack.unshift(0)
        }
    }
    hasColoredTileInDirection([X,Y]) {
        const WHITE = '#FFF',
              BLACK = '#000',
              TILE_IS_COLORED = t => t !== WHITE && t !== BLACK

        if (Y === undefined)
            throw new Error('Y is undefined')

        if (this.dp === 0) {
            let found = false

            for(let i = 1; X+i < this.src[0][0].length - 1; i++) {
                const TILE_COLOR = this.src[Y][X+i].color

                if (TILE_IS_COLORED(TILE_COLOR)) {
                    found = true
                    break
                }
            }

            return found
        } else if ( this.dp === 1 ) {
            let found = false

            for(let i = 1; Y+i < this.src.length - 1; i++) {
                const TILE_COLOR = this.src[Y+i][X].color

                if (TILE_IS_COLORED(TILE_COLOR)) {
                    found = true
                    break
                }
            }

            return found  
        } else if ( this.dp === 2 ) {
            let found = false

            for(let i = 1; X-i < -1; i++) {
                const TILE_COLOR = this.src[Y][X-i].color

                if (TILE_IS_COLORED(TILE_COLOR)) {
                    found = true
                    break
                }
            }

            return found  
        } else if ( this.dp === 3 ) {
            let found = false

            for(let i = 1; Y-i < -1; i++) {
                const TILE_COLOR = this.src[Y-i][X].color

                if (TILE_IS_COLORED(TILE_COLOR)) {
                    found = true
                    break
                }
            }

            return found  
        }

        throw new Error([
            `\n`,
            `Direction Pointer is out of range`,
            `this.dp === ${this.dp}`
        ].join("\n"))
    }
    hasBlackTileInNextMove(tile) {
        const [X,Y] = tile.map(n => +n)

        if (this.dp === 0 && X+1 < this.src[0].length) {
            return this.src[Y][X+1].color === '#000'
        } else if (this.dp === 1 && Y+1 < this.src.length) {
            return this.src[Y+1][X].color === '#000'
        } else if (this.dp === 2 && X-1 > -1) {
            return this.src[Y][X-1].color === '#000'
        } else if (this.dp === 3 && Y-1 > -1) {
            return this.src[Y-1][X].color === '#000'
        }

        return false
    }
    hasColoredTileInNextMove(tile) {
        const [X,Y] = tile.map(n => +n)

        if (this.dp === 0 && X+1 < this.src[0].length) {
            return this.src[Y][X+1].color !== '#000' && this.src[Y][X+1].color !== '#FFF'
        } else if (this.dp === 1 && Y+1 < this.src.length) {
            return this.src[Y+1][X].color !== '#000' && this.src[Y+1][X].color !== '#FFF'
        } else if (this.dp === 2 && X-1 > -1) {
            return this.src[Y][X-1].color !== '#000' && this.src[Y][X-1].color !== '#FFF'
        } else if (this.dp === 3 && Y-1 > -1) {
            return this.src[Y-1][X].color !== '#000' && this.src[Y-1][X].color !== '#FFF'
        }

        return false
    }
    incharOperation() {
        this.waitingForIO = true
        const prompt = input => {
            if (input === undefined)
                throw new Error(`a valid input is required`)

            this.stack.unshift(input.charCodeAt(0))
            this.waitingForIO = false
        }

        return { 
            prompt,
            type: 'Char'
        }
    }
    innumberOperation() {
        this.waitingForIO = true

        const prompt = input => {
            if (input === undefined)
                throw new Error(`a valid input is required`)

            this.stack.unshift(+input)
            this.waitingForIO = false
        }

        return { 
            prompt,
            type: 'Number'
        }
    }
    run() {
        
    }
    modOperation() {
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        this.stack.unshift( SECOND_NUM % FIRST_NUM )
    }
    multiplyOperation() {
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        this.stack.unshift( FIRST_NUM * SECOND_NUM )
    }
    notOperation() {
        const TOP_NUM = this.stack.shift()

        if (TOP_NUM === 0) {
            this.stack.unshift(1)
        } else {
            this.stack.unshift(0)
        }
    }
    operationIsValid(operation) {
        return operation &&
               operation.trim().length > 0 &&
               FLATTENED_COMMANDS.includes(operation)
    }
    outcharOperation() {
        const OUTPUT = this.stack.shift()

        if (OUTPUT !== undefined) {
            return {
                output: String.fromCharCode(OUTPUT)
            }
        }
    }
    outnumberOperation() {
        const OUTPUT = this.stack.shift()

        if (OUTPUT !== undefined) {
            return {
                output: `${OUTPUT}`
            }
        }
    }
    // TODO -- pointerOperation is sloppy
    pointerOperation() {
        let pointerRotations = this.stack.shift()

        if (pointerRotations !== undefined) {
            if (pointerRotations > 0) {
                this.dp = Math.abs((this.dp + pointerRotations) % 4)
            } else {
                while(pointerRotations < 0) {
                    this.dp--
                    if (this.dp < 0) {
                        this.dp = 3
                    }
                    pointerRotations++
                }
            }
        }
    }
    popOperation() {
        this.stack.shift()
    }
    programEndCleanup() {
        this.finished = true
    }
    pushOperation() {
        this.stack.unshift(this.tmpRegister)
    }
    rollOperation() {
        let rolls = this.stack.shift()
        
        const DEPTH = this.stack.shift()

        if (DEPTH < 0 || DEPTH > this.stack.length)
            return

        const TMP_FRONT = this.stack.slice(0,DEPTH),
              TMP_BACK  = this.stack.slice(DEPTH)

        if (rolls > 0) {
            while(rolls > 0) {
                const tmp = TMP_FRONT.shift()
                TMP_FRONT.push(tmp)
                rolls--
            }
        } else if (rolls < 0) {
            while(rolls < 0) {
                const tmp = TMP_FRONT.pop()
                TMP_FRONT.unshift(tmp)
                rolls++
            }
        }

        this.stack = [...TMP_FRONT, ...TMP_BACK]
    }
    step() {
        if (this.finished || this.operationPoint === null || this.attemptedMoves === 8) {
            return {halt: true}
        }

        if (!this.previousCommand) {
            this.previousCommand = 'no op'
        }

        if (this.waitingForIO) {
            throw new Error(`step cannot be called before fulfilling IO obligations`)
        }

        const PIXEL_GROUP        = this.getColorGroup(...this.operationPoint),
              CURRENT_COLOR_HEX  = this.src[this.operationPoint[1]][this.operationPoint[0]].color,
              CURRENT_COLOR_NAME = COLORS_BY_HEX[CURRENT_COLOR_HEX]

        if (!CURRENT_COLOR_NAME) {
            console.log(this.src[this.operationPoint[1]][this.operationPoint[0]])
            throw new Error([

              `\n           Y: ${this.operationPoint[1]}`,
                `           X: ${this.operationPoint[0]}`,
                `xAxis.length: ${this.src[0].length}`,
                ` PIXEL_GROUP: ${PIXEL_GROUP}`,
                ` CURRENT_HEX: ${CURRENT_COLOR_HEX}`,
                `  COLOR_NAME: ${CURRENT_COLOR_NAME}`

            ].join("\n"))
        }

        const COMMAND = this.getCommandFromColor(this.previousColor, CURRENT_COLOR_NAME) || 'no op',
              RESPONSE = {}

        if (COMMAND !== 'no op') {
            const IO = this.executeOperation(COMMAND)

            if (IO !== null &&
                typeof IO === 'object' &&
                IO.hasOwnProperty('prompt')
            ){
                RESPONSE.prompt     = IO.prompt
                RESPONSE.promptType = IO.type
            }

            if (
                IO !== null &&
                typeof IO === 'object' &&
                IO.hasOwnProperty('output')
            ) {
                RESPONSE.output = IO.output
            }
        }

        const EXIT_NODE = this.findExitNode(PIXEL_GROUP)

        this.previousCommand = COMMAND
        this.tmpRegister = PIXEL_GROUP.length
        this.previousColor = CURRENT_COLOR_NAME
        this.operationPoint = this.getNextOperationPoint(EXIT_NODE, PIXEL_GROUP)
        this.currentStep += 1
        this.exitNode = EXIT_NODE

        if (this.attemptedMoves === 8) {
            RESPONSE.halt = true,
            RESPONSE.stack = this.stack
            
            return RESPONSE
        }
        
        RESPONSE.halt = false
        RESPONSE.stack = this.stack

        return RESPONSE
    }
    switchOperation() {
        const TOGGGLE_AMOUNT = this.stack.shift()

        this.cc = (this.cc + TOGGGLE_AMOUNT) % 2
    }
    subtractOperation() {
        const FIRST_NUM  = this.stack.shift(),
              SECOND_NUM = this.stack.shift()

        this.stack.unshift( SECOND_NUM - FIRST_NUM )
    }
}