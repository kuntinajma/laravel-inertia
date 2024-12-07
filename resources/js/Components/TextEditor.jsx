import React, { Component } from "react";
import Trix from "trix";

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.trixInput = React.createRef();
    }

    componentDidMount() {
        this.trixInput.current.addEventListener("trix-change", event => {
            console.log("trix change event fired");
            this.props.onChange(event.target.innerHTML); //calling custom event
        });
    }

    render() {
        return (
            <div className="w-full max-w-3xl mx-auto mt-4">
                <input type="hidden" id="trix" value={this.props.value} />
                <trix-editor input="trix" ref={this.trixInput} className="trix-editor border-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        );
    }
}

export default TextEditor;