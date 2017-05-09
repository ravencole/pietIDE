import { assert } from 'chai'

import { mockSource } from './mocks'
import Interpreter from '../src/Interpreter'

const fullProgramDebug = _interpreter => {
    console.log('STACK          ',_interpreter.stack)
    console.log('previousCommand',_interpreter.previousCommand)
    console.log('previousColor  ',_interpreter.previousColor)
    console.log('DP             ',_interpreter.dp)
    console.log('CC             ',_interpreter.cc)
    console.log('operationPoint ',_interpreter.operationPoint)
    console.log('step           ',_interpreter.currentStep)
    console.log('tmpRegister    ',_interpreter.tmpRegister)
    console.log('----------------------------------------')
}

describe('Interpreter', () => {
    describe('getColorGroup', () => {
        it('gathers 1 square of color', () => {
            const SRC = mockSource(10,10,[['lr']]),
                  INTERPRETER = new Interpreter(SRC),
                  EXPECTED = ['0:0'],
                  ACTUAL = INTERPRETER.getColorGroup(0,0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('gathers a rectangle', () => {
            const SRC = mockSource(10,10,[
                    ['mr','mr','mr','mr'],
                    ['mr','mr','mr','mr'],
                    ['mr','mr','mr','mr'],
                    ['mr','mr','mr','mr']
                  ]),
                  INTERPRETER = new Interpreter(SRC),
                  EXPECTED = [
                    '0:0','1:0','2:0','3:0',
                    '0:1','1:1','2:1','3:1',
                    '0:2','1:2','2:2','3:2',
                    '0:3','1:3','2:3','3:3'
                  ].sort(),
                  ACTUAL = INTERPRETER.getColorGroup(0,0).sort()

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('gathers an essentric shape', () => {
            const SRC = mockSource(10,10,[
                    // 0    1    2    3    4    5    6
                    ['mr','mr','mr','mr','mr','wh','mr'], // 0
                    ['wh','mr','mr','mr','mr','mr','mr'], // 1
                    ['wh','mr','mr','mr','mr','mr','wh'], // 2
                    ['wh','mr','mr','mr','mr','wh','wh'], // 3
                    ['wh','wh','wh','wh','mr','wh','wh'], // 4
                    ['wh','wh','wh','wh','mr','wh','wh'], // 5
                    ['mr','mr','mr','mr','mr','wh','wh'], // 6
                    ['mr','wh','wh','wh','mr','wh','wh'], // 7
                  ]),
                  INTERPRETER = new Interpreter(SRC),
                  EXPECTED = [
                    '0:0','1:0','2:0','3:0','4:0',/*  */'6:0',
                    /*  */'1:1','2:1','3:1','4:1','5:1','6:1',
                    /*  */'1:2','2:2','3:2','4:2','5:2',/*  */
                    /*  */'1:3','2:3','3:3','4:3',/*  *//*  */
                    /*  *//*  *//*  *//*  */'4:4',/*  *//*  */
                    /*  *//*  *//*  *//*  */'4:5',/*  *//*  */
                    '0:6','1:6','2:6','3:6','4:6',/*  *//*  */
                    '0:7',/*  *//*  *//*  */'4:7' /*  *//*  */
                  ].sort(),
                  ACTUAL = INTERPRETER.getColorGroup(0,0).sort()

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('gathers an essentric shape that starts at 5,0', () => {
            const SRC = mockSource(30,30,[
                    // 0    1    2    3    4    5    6    7
                    ['wh','wh','wh','wh','wh','mr','mr','mr'], // 0
                    ['wh','wh','wh','wh','wh','wh','wh','mr'], // 1
                    ['wh','wh','wh','wh','wh','mr','mr','mr'], // 2
                    ['wh','wh','wh','wh','wh','mr','wh','wh'], // 3
                    ['wh','wh','wh','wh','mr','mr','wh','wh'], // 4
                    ['wh','wh','wh','mr','mr','wh','wh','wh'], // 5
                    ['wh','wh','wh','wh','mr','wh','wh','wh'], // 6
                    ['mr','mr','mr','mr','mr','mr','mr','mr']  // 7
                  ]),
                  INTERPRETER = new Interpreter(SRC),
                  EXPECTED = [
                    //  0     1     2     3     4     5     6     7
                    /*  *//*  *//*  *//*  *//*  */ '5:0','6:0','7:0', // 0
                    /*  *//*  *//*  *//*  *//*  *//*  *//*  */ '7:1', // 1
                    /*  *//*  *//*  *//*  *//*  */ '5:2','6:2','7:2', // 2 
                    /*  *//*  *//*  *//*  *//*  */ '5:3',/*  *//*  */ // 3
                    /*  *//*  *//*  *//*  */ '4:4','5:4',/*  *//*  */ // 4
                    /*  *//*  *//*  */ '3:5','4:5',/*  *//*  *//*  */ // 5
                    /*  *//*  *//*  *//*  */ '4:6',/*  *//*  *//*  */ // 6
                     '0:7','1:7','2:7','3:7','4:7','5:7','6:7','7:7'  // 7
                  ].sort(),
                  ACTUAL = INTERPRETER.getColorGroup(5,0).sort()

            assert.deepEqual(EXPECTED, ACTUAL)
        })
    })
    describe('getExitNode', () => {
        describe('exits correctly when', () => {
            it('direction = 0, codelChooser = 0', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = INTERPRETER.cc = 0

                const EXPECTED = [3,0],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 0, codelChooser = 1', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 0
                INTERPRETER.cc = 1

                const EXPECTED = [3,3],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 1, codelChooser = 0', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 1
                INTERPRETER.cc = 0

                const EXPECTED = [3,3],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 1, codelChooser = 1', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = INTERPRETER.cc = 1

                const EXPECTED = [0,3],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 2, codelChooser = 0', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 2
                INTERPRETER.cc = 0

                const EXPECTED = [0,3],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 2, codelChooser = 1', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 2
                INTERPRETER.cc = 1

                const EXPECTED = [0,0],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 3, codelChooser = 0', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 3
                INTERPRETER.cc = 0

                const EXPECTED = [0,0],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('direction = 3, codelChooser = 1', () => {
                const SRC = mockSource(20,20,[
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr'],
                        ['mr','mr','mr','mr']
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = 3
                INTERPRETER.cc = 1

                const EXPECTED = [3,0],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('the shape is essentric and direction = 1, codelChooser = 1', () => {
                const SRC = mockSource(30,30,[
                        // 0    1    2    3    4    5
                        ['mr','mr','mr','mr','mr','mr'], // 0
                        ['wh','dr','mr','lg','lg','mg'], // 1
                        ['wh','mr','mr','lg','lg','lg'], // 2
                        ['wh','mr','wh','lg','lg','mr'], // 3
                        ['wh','mr','mr','mr','mr','mr']  // 4
                      ]),
                      INTERPRETER = new Interpreter(SRC),
                      PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

                INTERPRETER.dp = INTERPRETER.cc = 1

                const EXPECTED = [1,4],
                      ACTUAL   = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
    })
    describe('getCommandFromColor', () => {
        describe('correctly gets the new command when', () => {
            it('the current color is midGreen and the next color is darkGreen', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC),
                      EXPECTED = 'push',
                      ACTUAL = INTERPRETER.getCommandFromColor('midGreen', 'darkGreen')

                assert.equal(EXPECTED, ACTUAL)
            })
            it('the current color is midYellow and the next color is darkBlue', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC),
                      EXPECTED = 'pointer',
                      ACTUAL = INTERPRETER.getCommandFromColor('midYellow', 'darkBlue')

                assert.equal(EXPECTED, ACTUAL)
            })
            it('the current color is lightMagenta and the next color is lightCyan', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC),
                      EXPECTED = 'duplicate',
                      ACTUAL = INTERPRETER.getCommandFromColor('lightMagenta', 'lightCyan')

                assert.equal(EXPECTED, ACTUAL)
            })
            it('the current color is white and the next color is lightCyan', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC),
                      EXPECTED = 'no op',
                      ACTUAL = INTERPRETER.getCommandFromColor('white', 'lightCyan')

                assert.equal(EXPECTED, ACTUAL)
            })
        })
    })
    describe('executeOperation', () => {
        describe('addOperation', () => {
            it('can add the top two numbers in the stack together', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)
                  
                INTERPRETER.stack = [2,3]

                INTERPRETER.executeOperation('add')

                const EXPECTED = 5,
                      ACTUAL   = INTERPRETER.stack[0]

                assert.equal(EXPECTED, ACTUAL)
            })
        })
        describe('divideOperation', () => {
            it('can divide the top most value by stack[1] and shift the value back to the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [5,20,3,2,1]

                INTERPRETER.executeOperation('divide')

                const EXPECTED = 4,
                      ACTUAL = INTERPRETER.stack[0]

                assert.deepEqual(EXPECTED, ACTUAL)
                assert.deepEqual([4,3,2,1], INTERPRETER.stack)
            })
            it('can divide the two numbers, and return the Integer value when there is a remainder', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [5,24,3,2,1]

                INTERPRETER.executeOperation('divide')

                const EXPECTED = 4,
                      ACTUAL = INTERPRETER.stack[0]

                assert.deepEqual(EXPECTED, ACTUAL)
                assert.deepEqual([4,3,2,1], INTERPRETER.stack)
            })
            it('cancels the operation if either value is 0', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [0,24,3,2,1]

                INTERPRETER.executeOperation('divide')

                assert.deepEqual([3,2,1], INTERPRETER.stack)
            })
        })
        describe('duplicateOperation', () => {
            it('can add the top two numbers in the stack together', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [2,3]

                INTERPRETER.executeOperation('duplicate')

                const EXPECTED = 2,
                      ACTUAL   = INTERPRETER.stack[0]

                assert.equal(EXPECTED, ACTUAL)
                assert.equal(INTERPRETER.stack.length, 3)
            })
        })
        describe('greaterOperation', () => {
            describe('if stack[1] is greater than stack[0], push 1, else push 0', () => {
                it('stack[1] is less than or equal to stack[0]', () => {
                    const SRC = mockSource(20,20),
                          INTERPRETER = new Interpreter(SRC)

                    INTERPRETER.stack = [5,4,3,2,1]

                    INTERPRETER.executeOperation('greater')

                    const EXPECTED = 0,
                          ACTUAL = INTERPRETER.stack[0]

                    assert.deepEqual(EXPECTED, ACTUAL)
                    assert.deepEqual([0,3,2,1], INTERPRETER.stack)    
                })
                it('stack[1] is greater than stack[0]', () => {
                    const SRC = mockSource(20,20),
                          INTERPRETER = new Interpreter(SRC)

                    INTERPRETER.stack = [4,5,3,2,1]

                    INTERPRETER.executeOperation('greater')

                    const EXPECTED = 1,
                          ACTUAL = INTERPRETER.stack[0]

                    assert.deepEqual(EXPECTED, ACTUAL)
                    assert.deepEqual([1,3,2,1], INTERPRETER.stack)    
                })
            })
        })
        describe('incharOperation', () => {
            it('prompts for input from the front end', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                const PROMPT = INTERPRETER.executeOperation('in(char)').prompt
                PROMPT('a')

                const EXPECTED = [97],
                      ACTUAL = INTERPRETER.stack

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
        describe('innumberOperation', () => {
            it('prompts the front end for a number', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                const PROMPT = INTERPRETER.executeOperation('in(number)').prompt
                PROMPT('33')

                const EXPECTED = [33],
                      ACTUAL   = INTERPRETER.stack  

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
        describe('modOperation', () => {
            it('calculated stack[1] mod stack[0] and pushes the result to the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [20,44,3,2,1]

                INTERPRETER.executeOperation('mod')

                const EXPECTED = 4,
                      ACTUAL = INTERPRETER.stack[0]

                assert.deepEqual(EXPECTED, ACTUAL)
                assert.deepEqual([4,3,2,1], INTERPRETER.stack)
            })
        })
        describe('multiplyOperation', () => {
            it('can multiply the top two values of the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [5,4,3,2,1]

                INTERPRETER.executeOperation('multiply')

                const EXPECTED = 20,
                      ACTUAL = INTERPRETER.stack[0]

                assert.deepEqual(EXPECTED, ACTUAL)
                assert.deepEqual([20,3,2,1], INTERPRETER.stack)
            })
        })
        describe('notOperation', () => {
            describe('if the top stack value is 0', () => {
                it('replaces the top value with 1', () => {
                    const SRC = mockSource(20,20),
                          INTERPRETER = new Interpreter(SRC)

                    INTERPRETER.stack = [0,3,2,1]

                    INTERPRETER.executeOperation('not')

                    const EXPECTED = 1,
                          ACTUAL = INTERPRETER.stack[0]

                    assert.deepEqual(EXPECTED, ACTUAL)
                    assert.deepEqual([1,3,2,1], INTERPRETER.stack)  
                })
            })
            describe('if the top stack value is not 0', () => {
                it('replaces the top value with 0', () => {
                    const SRC = mockSource(20,20),
                          INTERPRETER = new Interpreter(SRC)

                    INTERPRETER.stack = [66,3,2,1]

                    INTERPRETER.executeOperation('not')

                    const EXPECTED = 0,
                          ACTUAL = INTERPRETER.stack[0]

                    assert.deepEqual(EXPECTED, ACTUAL)
                    assert.deepEqual([0,3,2,1], INTERPRETER.stack)  
                })
            })
        })
        describe('outcharOperation', () => {
            it('outputs a char value to the front end', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [97,4,3,2,1]

                const RES      = INTERPRETER.executeOperation('out(char)').output,
                      ACTUAL   = INTERPRETER.stack,
                      EXPECTED = [4,3,2,1]

                assert.equal('a',RES)
                assert.deepEqual(EXPECTED,ACTUAL)
            })
        })
        describe('outnumberOperation', () => {
            it('outputs a number value to the front end', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [97,4,3,2,1]

                const RES      = INTERPRETER.executeOperation('out(number)').output,
                      ACTUAL   = INTERPRETER.stack,
                      EXPECTED = [4,3,2,1]

                assert.equal(97,RES)
                assert.deepEqual(EXPECTED,ACTUAL)
            })
        })
        describe('pointerOperation', () => {
            it('shift the top value from the stack and rotates the pointer by 90deg that many times', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [8,5,6,7,8,9]

                INTERPRETER.executeOperation('pointer')

                const EXPECTED = 0,
                      ACTUAL = INTERPRETER.dp

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('rotates the pointer counter clockwise when passed a negative number', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [-3,9,8,7,6,5,4,3,2,1]

                INTERPRETER.executeOperation('pointer')

                const EXPECTED = 1,
                      ACTUAL = INTERPRETER.dp  

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
        describe('popOperation', () => {
            it('can pop a value off the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [1,2,3,4,5]

                INTERPRETER.executeOperation('pop')

                const EXPECTED = [2,3,4,5],
                      ACTUAL   = INTERPRETER.stack

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
        describe('pushOperation', () => {
            it('can push a new value onto the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack       = [5,4,3,2,1]
                INTERPRETER.tmpRegister = 30

                INTERPRETER.executeOperation('push')

                const EXPECTED = 30,
                      ACTUAL   = INTERPRETER.stack[0]

                assert.equal(EXPECTED, ACTUAL)
            })
        })
        describe('rollOperation', () => {
            it('correctly rolls 3,4', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [3,2,4,3,2,1]

                INTERPRETER.executeOperation('roll')

                const EXPECTED = [3,4,2,1],
                      ACTUAL   = INTERPRETER.stack

                assert.deepEqual(EXPECTED, ACTUAL)
            })
            it('correctly rolls -3,5', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [-3,5,7,6,5,4,3,2,1]

                INTERPRETER.executeOperation('roll')

                const EXPECTED = [5,4,3,7,6,2,1],
                      ACTUAL   = INTERPRETER.stack

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
        describe('subtractOperation', () => {
            it('can subtract the stack[1] from stack[0] and shift the result back to the stack', () => {
                const SRC         = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [5,4,3,2,1]

                INTERPRETER.executeOperation('subtract')

                const EXPECTED = -1,
                      ACTUAL = INTERPRETER.stack[0]

                assert.deepEqual(EXPECTED, ACTUAL)
                assert.deepEqual([-1,3,2,1], INTERPRETER.stack)
            })
        })
        describe('switchOperation', () => {
            it('shift the top value from the stack and toggle the cc that many times', () => {
                const SRC = mockSource(20,20),
                      INTERPRETER = new Interpreter(SRC)

                INTERPRETER.stack = [7,5,6,7,8,9]

                INTERPRETER.executeOperation('switch')

                const EXPECTED = 1,
                      ACTUAL = INTERPRETER.cc

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
    })
})
describe('getNextOperationPoint', () => {
    it('can get the next point when the direction and codel do not have to change', () => {
        const SRC = mockSource(20,20,[
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
              ]),
              INTERPRETER = new Interpreter(SRC),
              PIXEL_GROUP = INTERPRETER.getColorGroup(0,0)

        INTERPRETER.dp = INTERPRETER.cc = 0

        const EXPECTED = [4,0],
              ACTUAL = INTERPRETER.getNextOperationPoint([3,0],PIXEL_GROUP)

        assert.deepEqual(EXPECTED, ACTUAL)
    })
    it('can get the next point when it has to change direction', () => {
        const SRC = mockSource(20,20,[
                ['wh','wh','wh','wh'],
                ['wh','wh','wh','wh'],
                ['wh','wh','wh','wh'],
                ['mr','wh','wh','wh'],
              ]),
              INTERPRETER = new Interpreter(SRC),
              PIXEL_GROUP = INTERPRETER.getColorGroup(0,3)

        INTERPRETER.dp = 2
        INTERPRETER.cc = 0

        const EXPECTED = [0,2],
              ACTUAL   = INTERPRETER.getNextOperationPoint([0,3],PIXEL_GROUP)

        assert.deepEqual(EXPECTED, ACTUAL)
        assert.equal(INTERPRETER.dp, 3)
    })
    it('can properly tell when a program should end', () => {
        const SRC = mockSource(20,20,[
                ['wh','wh','bl','wh','wh'],
                ['wh','bl','lg','bl','wh'],
                ['wh','bl','lg','wh','wh'],
                ['wh','bl','lg','bl','wh'],
                ['wh','wh','bl','wh','wh'],
              ]),
              INTERPRETER = new Interpreter(SRC),
              PIXEL_GROUP = INTERPRETER.getColorGroup(2,2),
              EXIT_NODE   = INTERPRETER.findExitNode(PIXEL_GROUP)

        assert.isNull(INTERPRETER.getNextOperationPoint(EXIT_NODE, PIXEL_GROUP))
    })
})
describe('step', () => {
    it('can execute the first command of a program', () => {
        const SRC = mockSource(20,20,[
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr']
              ]),
              INTERPRETER = new Interpreter(SRC)

        INTERPRETER.step()

        assert.equal(INTERPRETER.dp, 0)
        assert.equal(INTERPRETER.cc, 0)
        assert.equal(INTERPRETER.tmpRegister, 16)
        assert.equal(INTERPRETER.previousColor, 'midRed')
        assert.deepEqual(INTERPRETER.stack, [])
        assert.deepEqual(INTERPRETER.operationPoint, [4,0])
    })
    it('can execute the first two commands of a program', () => {
        const SRC = mockSource(20,20,[
                ['mr','mr','mr','mr','dr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr']
              ]),
              INTERPRETER = new Interpreter(SRC)

        INTERPRETER.step()
        INTERPRETER.step()

        assert.equal(INTERPRETER.dp, 0)
        assert.equal(INTERPRETER.cc, 0)
        assert.equal(INTERPRETER.tmpRegister, 1)
        assert.deepEqual(INTERPRETER.stack, [16])
        assert.equal(INTERPRETER.previousColor, 'darkRed')
        assert.deepEqual(INTERPRETER.operationPoint, [5,0])
    })
    it('can execute a 4 step program that adds 4 and 4',() => {
        const SRC = mockSource(20,20,[
                ['mr','mr','dr','dr','lr','ly'],
                ['mr','mr','dr','dr']
              ]),
              INTERPRETER = new Interpreter(SRC)

        let count = 0

        while(count < 4) {
            INTERPRETER.step()
            count++
        }

        assert.equal(INTERPRETER.dp, 0)
        assert.equal(INTERPRETER.cc, 0)
        assert.equal(INTERPRETER.tmpRegister, 1)
        assert.deepEqual(INTERPRETER.stack, [8])
        assert.equal(INTERPRETER.previousColor, 'lightYellow')
        assert.deepEqual(INTERPRETER.operationPoint, [6,0])
    })
    it('can run a 15 step program', () => {
        const SRC = mockSource(15,15,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13
                ['mr','dr','lr','mr','dr','lr','mr','dr','lb','wh','mr','dr','ly','mb'], // 0
                ['wh','dr','lr','mr','dr','lr','mr','wh','wh','wh','mr','wh','wh','wh'], // 1
                ['wh','wh','lr','mr','dr','lr','wh','wh','wh','wh','wh','wh','wh','wh'], // 2
                ['wh','wh','wh','mr','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 3
                ['wh','wh','wh','wh','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 4
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 5
                ['wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 6
                ['bl','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 7
                ['bl','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg'], // 8
                ['bl','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl'], // 9
                ['wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 10
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh']  // 11
              ]),
              INTERPRETER = new Interpreter(SRC)

        let halt  = false,
            count = 0

        while(!halt) {
            const res = INTERPRETER.step()
            // fullProgramDebug(INTERPRETER)
            count++
            halt = res.halt
        }

        const EXPECTED = [5,4,2,1],
              ACTUAL   = INTERPRETER.stack

        assert.deepEqual(EXPECTED, ACTUAL)
    })
    it('can run a fibonacci program', () => {
        const SRC = mockSource(20,20,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
                ['mr','dr','wh','wh','mr','dr','lr','my','dy','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl'], // 0
                ['mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 1
                ['mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 2
                ['mr','wh','wh','wh','wh','bl','bl','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 3
                ['mr','wh','wh','wh','bl','mg','mg','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 4
                ['wh','wh','wh','wh','wh','bl','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 5
                ['bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 6
                ['mg','wh','mr','mr','mr','dr','lc','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 7
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 8
                ['wh','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 9
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
                ['wh','wh','mg','wh','mr','dr','lr','mb','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl'], // 10
                ['wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 11
                ['wh','wh','ly','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 12
                ['wh','wh','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 13
                ['wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 14
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mc','wh','wh','wh','mb','wh','wh','wh','wh'], // 15
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dc','mc','wh','wh','wh','mb','wh','wh','wh','wh'], // 16
                ['lg','wh','dr','mc','mr','lm','dm','mm','my','lc','dc','mc','mg','lb','db','mb','mr','wh','mg','wh'], // 17
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh'], // 18
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh']
              ]),
              INTERPRETER = new Interpreter(SRC)

        const EXPECTED = [0,13,8]

        let count = 0,
            halt  = false

        while(!halt) {
            const res = INTERPRETER.step()
            // fullProgramDebug(INTERPRETER)
            count++
            halt = res.halt
        }

        assert.deepEqual(EXPECTED,INTERPRETER.stack)
    })
    it('can run a program that uses all non IO operations', () => {
        const SRC = mockSource(0,0,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
                ['mr','dr','lr','mr','dr','lr','mr','my','lg','lr','lb','lm','mm','dm','lc','lm','wh','wh','wh','mg'], // 0
                ['mr','dr','lr','mr','dr','wh','wh','wh','wh','wh','wh','lm','wh','wh','wh','wh','wh','wh','wh','wh'], // 1
                ['mr','dr','lr','mr','wh','wh','wh','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 2
                ['mr','dr','lr','wh','wh','wh','wh','wh','mg','wh','wh','wh','mg','bl','wh','wh','wh','wh','wh','wh'], // 3
                ['mr','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dg','wh','wh','wh','wh','wh','wh','wh'], // 4
                ['mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mm','wh','wh','wh','wh','wh','wh','wh'], // 5
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 6
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 7
                ['wh','bl','bl','bl','wh','wh','wh','wh','dm','mg','wh','wh','wh','wh','wh','wh','dr','mr','wh','mg'], // 8
                ['bl','mg','mg','mg','bl','wh','wh','wh','bl','wh','wh','wh','mg','mg','mg','wh','wh','wh','wh','bl'], // 9
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
                ['wh','bl','wh','bl','wh','wh','wh','wh','mg','wh','mg','bl','mg','mg','mg','wh','wh','wh','wh','wh'], // 10
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','wh','wh','wh','wh','wh'], // 11
                ['wh','bl','lr','mr','dr','lr','mr','wh','wh','wh','mg','wh','mg','wh','mg','wh','wh','wh','wh','wh'], // 12
                ['wh','wh','wh','wh','wh','wh','wh','wh','mb','wh','bl','wh','dc','wh','wh','wh','wh','wh','wh','wh'], // 13
                ['wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','lm','wh','mg','wh','wh','wh','wh','wh'], // 14
                ['wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','mm','wh','wh','wh','wh','wh','wh','wh'], // 15
                ['wh','wh','wh','wh','wh','wh','wh','wh','dr','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh'], // 16
                ['wh','wh','wh','mr','mr','mr','mr','mr','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 17
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 18
                ['wh','wh','bl','mg','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh']  // 19
              ]),
              INTERPRETER = new Interpreter(SRC),
              EXPECTED    = [6]

        let count = 0,
            halt  = false

        while(!halt) {
            const res = INTERPRETER.step()
            // fullProgramDebug(INTERPRETER)
            halt = res.halt
            count++
        }

        assert.deepEqual(EXPECTED, INTERPRETER.stack)
    })
    it('can run a program with advenced control flow', () => {
        const SRC = mockSource(0,0,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33   34   35   36   37   38   39    
                ['mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  0
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  1
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','mm','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  2
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','mg','dg','lm','wh','wh','wh'], //  3
                ['wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  4
                ['wh','bl','wh','wh','wh','wh','bl','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  5
                ['wh','mg','wh','mr','mb','mg','wh','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  6
                ['wh','wh','wh','wh','wh','wh','bl','mg','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mc','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  7
                ['wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  8
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','wh','wh','wh'], //  9
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','wh','wh','wh'], // 10
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33   34   35   36   37   38   39 
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','mg','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','mg','wh','wh','mg','mg','mg','mg','wh','wh','wh'], // 11
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh'], // 12
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 13
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh'], // 14
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','wh','wh'], // 15
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','mg','bl','wh','wh','wh'], // 16
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 17
                ['wh','lm','dg','dg','dg','mg','my','mr','wh','mg','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','mg'], // 18
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','mg','mg','mg','mg','mg','mg','mg','mg','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','wh','wh','wh'], // 19
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 20
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33   34   35   36   37   38   39 
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 21
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 22
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dr','dr','wh','wh','wh','wh','wh','dr','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 23
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','lr','lr','lr','wh','wh','wh','wh','wh','wh','lr','wh','wh','bl','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg'], // 24
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','my','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl'], // 25
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','db','wh','wh','wh','wh','wh','wh','mr','dr','lr','my','db','wh','wh','wh','wh','wh','wh'], // 26
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','dr','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 27
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 28
                ['wh','wh','wh','wh','wh','wh','wh','wh','bl','mg','wh','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh']  // 29
              ]),
              INTERPRETER = new Interpreter(SRC),
              EXPECTED    = [6,6,6]

        let count = 0,
            halt  = false

        while(!halt) {
            const res = INTERPRETER.step()
            // fullProgramDebug(INTERPRETER)
            halt = res.halt
            count++
        }

        assert.deepEqual(EXPECTED, INTERPRETER.stack)
    })
    it('can run a program that uses the in(char) IO operation', () => {
        const SRC = mockSource(20,20,[
                ['mc','mg','mr','my']
              ]),
              INTERPRETER = new Interpreter(SRC)

        let count = 0

        while(count < 4) {
            const res = INTERPRETER.step()

            if (res.hasOwnProperty('prompt')) {
                res.prompt('g')
            }

            count++
        }

        const EXPECTED = [206],
              ACTUAL   = INTERPRETER.stack

        assert.deepEqual(EXPECTED, ACTUAL)

    })
    it('throws an error when step is called but IO obligations are not fulfilled', () => {
        assert.throws(_ => {
            const SRC = mockSource(20,20,[
                    ['mc','mg','mr','my']
                  ]),
                  INTERPRETER = new Interpreter(SRC)

            let count = 0

            while(count < 5) {
                INTERPRETER.step()
                count++
            }
        })
    })
    it('can run a simple program that uses all IO operations', () => {
        const SRC = mockSource(20,20,[
                ['mc','ly','lr','dm','lb']
              ]),
              INTERPRETER = new Interpreter(SRC),
              INPUTS      = ['6','s'],
              OUTPUT      = []

        let count = 0

        while(count < 5) {
            const RES = INTERPRETER.step()

            if (RES.hasOwnProperty('prompt')) {
                RES.prompt(INPUTS.shift())
            }

            if (RES.output) {
                OUTPUT.push(RES.output)
            }

            count++
        }

        const EXPECTED = ['s','6']

        assert.deepEqual(EXPECTED, OUTPUT)
    })
    it('runs a program with complicated IO', () => {
        // Asks for user input until '0' is give, then prints 'Thx'
        const SRC = mockSource(20,40,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32  
                ['mr','mr','dr','lr','dy','dm','wh','mc','mg','mr','wh','mr','dr','lr','mb','dm','my','db','mb','lb','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl'], //  0
                ['mr','mr','dr','wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','bl','bl','wh','wh','wh'], //  1
                ['mr','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','mg','mg','mg','bl','wh','wh'], //  2
                ['mr','mr','dm','mg','wh','wh','wh','wh','mm','my','lr','dr','mr','wh','wh','wh','wh','mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh','bl','wh','wh','wh'], //  3
                ['mr','mr','wh','bl','bl','bl','bl','bl','bl','bl','bl','dr','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','ly','wh','wh','wh','wh'], //  4
                ['mr','mr','wh','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','wh','wh','wh','wh'], //  5
                ['mr','mr','mg','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','my','my','wh','wh','wh'], //  6
                ['mr','mr','dm','wh','mr','my','mm','mc','mc','mc','dc','lb','dc','dc','lc','lb','dc','dc','dc','dc','dc','dc','lc','lb','dc','lc','mc','db','ly','wh','wh','wh','wh'], //  7
                ['mr','mr','wh','wh','wh','wh','wh','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','wh','wh','wh','lc','wh','wh','wh','wh','wh','wh','wh'], //  8
                ['mr','mr','wh','wh','wh','wh','wh','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], //  9
                ['mr','mr','wh','wh','wh','wh','wh','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 10
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32 
                ['mr','mr','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 11
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh'], // 12
                ['mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','wh'], // 13
                ['wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','bl','wh']  // 14
              ]),
              INTERPRETER = new Interpreter(SRC),
              INPUTS      = ['a','b','5','G','M','6','b','a','d','l','a','n','d','s','0'],
              OUTPUT      = []

        let count = 0,
            halt  = false

        while(!halt) {
            const RES = INTERPRETER.step()

            if (RES.hasOwnProperty('prompt')) {
                RES.prompt(INPUTS.shift())
            }

            if (RES.output) {
                OUTPUT.push(RES.output)
            }

            // fullProgramDebug(INTERPRETER)

            halt = RES.halt
            count++
        }

        const EXPECTED = ['T','h','x'],
              ACTUAL   = OUTPUT

        assert.deepEqual(EXPECTED, ACTUAL)
    })
    it('runs a program with complicated IO and lots of black squares', () => {
        // Asks for user input until '0' is give, then prints 'Thx'
        const SRC = mockSource(20,40,[
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32  
                ['mr','mr','dr','lr','dy','dm','wh','mc','mg','mr','wh','mr','dr','lr','mb','dm','my','db','mb','lb','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl'], //  0
                ['mr','mr','dr','bl','bl','bl','bl','bl','bl','bl','bl','mr','bl','bl','bl','bl','bl','wh','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl'], //  1
                ['mr','mr','bl','bl','bl','bl','bl','bl','bl','bl','bl','mr','bl','bl','bl','bl','bl','wh','bl','bl','bl','bl','bl','bl','bl','bl','bl','mg','mg','mg','bl','wh','bl'], //  2
                ['mr','mr','dm','mg','wh','wh','wh','wh','mm','my','lr','dr','mr','wh','wh','wh','wh','mg','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl','bl','wh','bl'], //  3
                ['mr','mr','wh','bl','bl','bl','bl','bl','bl','bl','bl','dr','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','ly','bl','bl','wh','bl'], //  4
                ['mr','mr','wh','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','bl','bl','wh','bl'], //  5
                ['mr','mr','mg','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','dy','my','my','bl','wh','bl'], //  6
                ['mr','mr','dm','wh','mr','my','mm','mc','mc','mc','dc','lb','dc','dc','lc','lb','dc','dc','dc','dc','dc','dc','lc','lb','dc','lc','mc','db','ly','bl','bl','wh','bl'], //  7
                ['mr','mr','bl','bl','bl','bl','bl','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','bl','bl','bl','lc','bl','bl','bl','bl','bl','wh','bl'], //  8
                ['mr','mr','bl','bl','bl','bl','bl','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl'], //  9
                ['mr','mr','bl','bl','bl','bl','bl','mc','mc','mc','bl','bl','dc','dc','bl','bl','dc','dc','dc','dc','dc','dc','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl'], // 10
                // 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32 
                ['mr','mr','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl'], // 11
                ['wh','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','wh','bl'], // 12
                ['mg','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','wh','mg','bl'], // 13
                ['bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl','bl']  // 14
              ]),
              INTERPRETER = new Interpreter(SRC),
              INPUTS      = ['a','b','5','G','M','6','b','a','d','l','a','n','d','s','0'],
              OUTPUT      = []

        let count = 0,
            halt  = false

        while(!halt) {
            const RES = INTERPRETER.step()

            if (RES.hasOwnProperty('prompt')) {
                RES.prompt(INPUTS.shift())
            }

            if (RES.output) {
                OUTPUT.push(RES.output)
            }

            // fullProgramDebug(INTERPRETER)

            halt = RES.halt
            count++
        }

        const EXPECTED = ['T','h','x'],
              ACTUAL   = OUTPUT

        assert.deepEqual(EXPECTED, ACTUAL)
    })
})