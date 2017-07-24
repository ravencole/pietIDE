import React, { Component } from 'react';

export default class UserInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.getUserIOInput) {
            this.setState({
                value: ''
            })
        } else {
            window.setTimeout( _ => {
                this.IOInput.focus()
            }, 600)
        }
    }
    onChange(e) {
        const TYPE = this.props.type

        console.log(this.props.type)

        if (TYPE === 'Char') {
            this.setState({
                value: e.target.value[e.target.value.length - 1]
            })
        } else if (Number.isInteger(+e.target.value)) {
            this.setState({
                value: e.target.value
            })
        }
    }
    onKeyDown(e) {
        if (e.keyCode === 13) {
            const VAL = this.state.value
            this.setState({
                value: ''
            })
            this.props.callback(VAL)
        }
    }
    render() {
        return (
            <div 
                className="iocontainer__input" 
                style={{
                    backgroundColor: this.props.backgroundColor
                }}
            >
                <label>Input a { this.props.type === 'Char' ? 'Character' : 'Number' }:</label>
                <input 
                    type="text" 
                    onKeyDown={ this.onKeyDown } 
                    onChange={ this.onChange } 
                    value={ this.state.value } 
                    ref={(i) => { this.IOInput = i }}
                />
            </div>
        )
    }
}
