import { assert } from 'chai'

import { mockSource } from './mocks'
import Interpreter from '../src/Interpreter'

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
        it('gathers an essentric shape that starts at 0,5', () => {
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
                  ACTUAL = INTERPRETER.getColorGroup(0,5).sort()

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
                      ACTUAL = INTERPRETER.findExitNode(PIXEL_GROUP)

                assert.deepEqual(EXPECTED, ACTUAL)
            })
        })
    })
})