import { assert } from 'chai'

import { compose } from '../src/helpers'
import { mockSource } from './mocks'
import { tokenizeColors } from '../src/Tokenizer'

describe('tokenizer', () => {
    describe('tokenizeColors', () => {
        it('returns an array', () => {
            compose([
                tokenizeColors,
                Array.isArray,
                assert.isTrue
            ], mockSource(10,10))
        })
        it('tokenizes color block starting at 0,0', () => {
            const INPUT = [
                [
                    {color: '#FF0000', loc: {x: 0, y:0}},
                    {color: '#FF0000', loc: {x: 1, y:0}},
                    {color: '#FF0000', loc: {x: 2, y:0}},
                    {color: '#FF0000', loc: {x: 3, y:0}}
                ],
                [
                    {color: '#FF0000', loc: {x: 0, y:1}},
                    {color: '#FF0000', loc: {x: 1, y:1}},
                    {color: '#FF0000', loc: {x: 2, y:1}},
                    {color: '#FF0000', loc: {x: 3, y:1}}
                ]
            ]

            const SRC = mockSource(10,10,INPUT),
                  EXPECTED = [{color: '#FF0000', size: 8}],
                  ACTUAL = tokenizeColors(SRC)

            console.log(ACTUAL)
            assert.equal(EXPECTED[0].color, ACTUAL[0].color)
            assert.equal(EXPECTED[0].size , ACTUAL[0].size )
        })
    })
})