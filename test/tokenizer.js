import { assert } from 'chai'

import { compose } from '../src/helpers'
import { mockSource, defaultCodelObj } from './mocks'
import { 
    findExitNode,
    gatherColorGroup,
    runProgram 
} from '../src/Tokenizer'
import {
    COLORS_ARRAY
} from '../src/components/constants'

xdescribe('tokenizer', () => {
    describe('gatherColorGroup', () => {
        it('can gather a 1 tile group', () => {
            const MOCK_SRC = [['mr']],
                  SRC = mockSource(10,10,MOCK_SRC),
                  EXPECTED = ['0:0'],
                  ACTUAL = gatherColorGroup(0,0,SRC)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a 1 column 2 row tile group', () => {
            const MOCK_SRC = [
                    ['mr'],
                    ['mr']
                  ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  EXPECTED = ['0:0','0:1'],
                  ACTUAL = gatherColorGroup(0,0,SRC)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a 5 column 2 row tile group', () => {
            const MOCK_SRC = [
                    ['mr','mr','mr','mr','mr'],
                    ['mr','mr','mr','mr','mr']
                  ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  EXPECTED = [
                    '0:0','1:0','2:0','3:0','4:0',
                    '0:1','1:1','2:1','3:1','4:1'
                  ].sort(),
                  ACTUAL = gatherColorGroup(0,0,SRC).sort()

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a 5 column 2 row tile group when other colors are present', () => {
            const MOCK_SRC = [
                    ['mr','mr','mr','mr','mr','dr','dr'],
                    ['mr','mr','mr','mr','mr','dr','dr'],
                    ['lb','lb','lb','lb','lb'],
                    ['mr','mr','mr','mr','mr']
                  ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  EXPECTED = [
                    '0:0','1:0','2:0','3:0','4:0',
                    '0:1','1:1','2:1','3:1','4:1'
                  ].sort(),
                  ACTUAL = gatherColorGroup(0,0,SRC).sort()

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a 5 column 2 row tile group when it starts at 5,0', () => {
            const MOCK_SRC = [
                    [undefined,undefined,undefined,undefined,undefined,'mr','mr','mr','mr','mr','dr','dr'],
                    [undefined,undefined,undefined,undefined,undefined,'mr','mr','mr','mr','mr','dr','dr'],
                    ['lb','lb','lb','lb','lb'],
                    ['mr','mr','mr','mr','mr']
                  ],
                  SRC = mockSource(15,15,MOCK_SRC),
                  EXPECTED = [
                    '5:0','6:0','7:0','8:0','9:0',
                    '5:1','6:1','7:1','8:1','9:1'
                  ].sort(),
                  ACTUAL = gatherColorGroup(0,5,SRC).sort()
            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a non rectangular tile group when it starts at 5,0', () => {
            const MOCK_SRC = [
                    [undefined,undefined,undefined,undefined,undefined,'mr','mr','mr','mr','mr','dr','dr'],
                    [undefined,undefined,undefined,undefined,undefined,'mr','mr','mr','mr','mr','dr','dr'],
                    [undefined,undefined,undefined,undefined,undefined,'mr','lb','lb','mr','lb'],
                    [undefined,undefined,undefined,undefined,undefined,'lr','lr','lr','lr','lr']
                  ],
                  SRC = mockSource(15,15,MOCK_SRC),
                  EXPECTED = [
                    '5:0','6:0','7:0','8:0','9:0',
                    '5:1','6:1','7:1','8:1','9:1',
                    '5:2',            '8:2'
                  ].sort(),
                  ACTUAL = gatherColorGroup(0,5,SRC).sort()
            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can gather a non rectangular tile that snakes around', () => {
            const MOCK_SRC = [
                    ['mr','mr','lr','mr','mr','mr','mr'],
                    ['lr','mr','mr','mr','lr','dr','mr'],
                    ['lr','lb','lb','mr','lb'],
                    ['lr','mr','mr','mr','lr']
                  ],
                  SRC = mockSource(15,15,MOCK_SRC),
                  EXPECTED = [
                    '0:0','1:0',      '3:0','4:0','5:0','6:0',
                          '1:1','2:1','3:1',            '6:1',
                                      '3:2',
                          '1:3','2:3','3:3'
                  ].sort(),
                  ACTUAL = gatherColorGroup(0,5,SRC).sort()
            assert.deepEqual(EXPECTED, ACTUAL)
        })
    })
    describe('findExitNode', () => {
        it('can find the exit node of a rectangle when the direction and codel are 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [2,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 0, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node an essentric when the direction and codel are 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr', 'mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [3,2],
                  ACTUAL = findExitNode(COLOR_GROUP, 0, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node a rectangle when the direction is 1 and the codel is 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [2,2],
                  ACTUAL = findExitNode(COLOR_GROUP, 1, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node an essentric when the direction is 1 and the codel is 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr','dg'],
                ['mr','mr','mr','dg'],
                ['mr','mr','mr','mr'],
                ['mr','dg','dg','mr'] 
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [3,3],
                  ACTUAL = findExitNode(COLOR_GROUP, 1, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node a rectangle when the direction is 2 and the codel is 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [0,2],
                  ACTUAL = findExitNode(COLOR_GROUP, 2, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node a rectangle when the direction is 2 and the codel is 1', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [0,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 2, 1)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node a rectangle when the direction is 3 and the codel is 0', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [0,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 3, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node a rectangle when the direction is 3 and the codel is 1', () => {
            const MOCK_SRC = [
                ['mr','mr','mr'],
                ['mr','mr','mr'],
                ['mr','mr','mr']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [2,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 3, 1)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node of a snaking shape when the direction is 3 and the codel is 1', () => {
            const MOCK_SRC = [
                ['mr','mr','mr','wh','mr','mr','mr','mr'],
                ['mr','mr','mr','mr','mr','wh','wh','wh'],
                ['mr','mr','mr','wh','wh','wh','wh','wh']
            ],
                  SRC = mockSource(10,10,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [7,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 3, 1)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
        it('can find the exit node of a single square when the direction is 1 and the codel is 0', () => {
            const MOCK_SRC = [['mr']],
                  SRC = mockSource(20,20,MOCK_SRC),
                  COLOR_GROUP = gatherColorGroup(0,0,SRC),
                  EXPECTED = [0,0],
                  ACTUAL = findExitNode(COLOR_GROUP, 1, 0)

            assert.deepEqual(EXPECTED, ACTUAL)
        })
    })
    describe('runProgram', () => {
        it('', () => {
            const SRC = [
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr'],
                ['mr','mr','mr','mr']
            ],
                  RESULT = runProgram(SRC)

            assert.equal(RESULT.stack.length, 0)
        })  
    })
})