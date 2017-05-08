export const COLORS = {
    lightRed:     '#FFC0C0',
    midRed:       '#FF0000',
    darkRed:      '#C00000',

    lightYellow:  '#FFFFC0',
    midYellow:    '#FFFF00',
    darkYellow:   '#C0C000',

    lightGreen:   '#C0FFC0',
    midGreen:     '#00FF00',
    darkGreen:    '#00C000',

    lightCyan:    '#C0FFFF',
    midCyan:      '#00FFFF',
    darkCyan:     '#00C0C0',

    lightBlue:    '#C0C0FF',
    midBlue:      '#0000FF',
    darkBlue:     '#0000C0',

    lightMagenta: '#FFC0FF',
    midMagenta:   '#FF00FF',
    darkMagenta:  '#C000C0',

    black:        '#000',
    white:        '#FFF'
}

export const COLORS_BY_SHORTCUT = {
    lr: 'lightRed',
    mr: 'midRed',
    dr: 'darkRed',
    ly: 'lightYellow',
    my: 'midYellow',
    dy: 'darkYellow',
    lg: 'lightGreen',
    mg: 'midGreen',
    dg: 'darkGreen',
    lc: 'lightCyan',
    mc: 'midCyan',
    dc: 'darkCyan',
    lb: 'lightBlue',
    mb: 'midBlue',
    db: 'darkBlue',
    lm: 'lightMagenta',
    mm: 'midMagenta',
    dm: 'darkMagenta',
    bl: 'black',
    wh: 'white'
}

export const COLORS_ARRAY = (() => 
    Object.keys(COLORS).reduce((a,b) => {
        if (a[a.length - 1].length >= 3) {
            a.push([])
        }

        a[a.length - 1].push({
            name: b,
            hex: COLORS[b],
            hue: b.replace(/light|dark|mid/g, '').toLowerCase(),
            lightness: b.includes('light') ? 'light' : b.includes('dark') ? 'dark' : 'mid'
        })

        return a
    }, [[]])
)()

export const COLORS_ARRAY_NO_BW = (() => {
    const CANBW = COLORS_ARRAY
    CANBW.pop()
    return CANBW
})()

export const COLORS_BY_HEX = Object.keys(COLORS).reduce((a,b) => {
    a[COLORS[b]] = b

    return a
}, {})

export const COMMANDS = [
    [
        ' ',
        'push',
        'pop'
    ],
    [
        'add',
        'subtract',
        'multiply'
    ],
    [
        'divide',
        'mod',
        'not'
    ],
    [   
        'greater',
        'pointer',
        'switch'
    ],
    [
        'duplicate',
        'roll',
        'in(number)'
    ],
    [
        'in(char)',
        'out(number)',
        'out(char)'
    ]
]

export const FLATTENED_COMMANDS = COMMANDS.reduce((a,b) => {
    b.map(command => a.push(command))
    return a
}, [])

export const COMMANDS_WITH_INDEX = COMMANDS.reduce((a,b,i) => {
    b.map((command,j) => {
        if (command.trim().length)
            a[command] = [i,j]
    })
    return a
}, {})

export const COMMAND_DESCRIPTIONS = {
    push: 'Pushes the value of the colour block just exited on to the stack. Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.',
    pop: 'Pops the top value off the stack and discards it.',
    add: 'Pops the top two values off the stack, adds them, and pushes the result back on the stack.',
    subtract: 'Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.',
    multiply: 'Pops the top two values off the stack, multiplies them, and pushes the result back on the stack.',
    divide: 'Pops the top two values off the stack, calculates the integer division of the second top value by the top value, and pushes the result back on the stack. If a divide by zero occurs, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.',
    mod: 'Pops the top two values off the stack, calculates the second top value modulo the top value, and pushes the result back on the stack. The result has the same sign as the divisor (the top value). If the top value is zero, this is a divide by zero error, which is handled as an implementation-dependent error, though simply ignoring the command is recommended.',
    not: 'Replaces the top value of the stack with 0 if it is non-zero, and 1 if it is zero.',
    greater: 'Pops the top two values off the stack, and pushes 1 on to the stack if the second top value is greater than the top value, and pushes 0 if it is not greater.',
    pointer: 'Pops the top value off the stack and rotates the DP clockwise that many steps (anticlockwise if negative).',
    switch: 'Pops the top value off the stack and toggles the CC that many times (the absolute value of that many times if negative).',
    duplicate: 'Pushes a copy of the top value on the stack on to the stack.',
    roll: 'Pops the top two values off the stack and "rolls" the remaining stack entries to a depth equal to the second value popped, by a number of rolls equal to the first value popped. A single roll to depth n is defined as burying the top value on the stack n deep and bringing all values above it up by 1 place. A negative number of rolls rolls in the opposite direction. A negative depth is an error and the command is ignored. If a roll is greater than an implementation-dependent maximum stack depth, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.',
    'in(char)': ' Reads a value from STDIN as either a number or character, depending on the particular incarnation of this command and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.',
    'in(int)': ' Reads a value from STDIN as either a number or character, depending on the particular incarnation of this command and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.',
    'out(char)': 'Pops the top value off the stack and prints it to STDOUT as either a number or character, depending on the particular incarnation of this command.',
    'out(int)': 'Pops the top value off the stack and prints it to STDOUT as either a number or character, depending on the particular incarnation of this command.'
}

export const SHORTCUT_LIST = {
    pu: 'push',
    po: 'pop',
    ad: 'add',
    su: 'subtract',
    mu: 'multiply',
    di: 'divide',
    mo: 'mod',
    no: 'not',
    gr: 'greater',
    pt: 'pointer',
    sw: 'switch',
    du: 'duplicate',
    ro: 'roll',
    ic: 'in(char)',
    ii: 'in(int)',
    oc: 'out(char)',
    oi: 'out(int)'
}