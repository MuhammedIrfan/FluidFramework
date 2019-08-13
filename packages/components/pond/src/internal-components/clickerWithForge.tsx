/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, SharedComponentFactory } from "@prague/aqueduct";
import {
    IComponentHTMLVisual,
} from "@prague/component-core-interfaces";
import {
    Counter,
    CounterValueType,
    ISharedMap,
    SharedMap,
} from "@prague/map";

import * as React from "react";
import * as ReactDOM from "react-dom";

// tslint:disable-next-line: no-var-requires no-require-imports
const pkg = require("../../package.json");
export const ClickerWithInitialValueName = `${pkg.name as string}-clickerWithInitialValue`;

/**
 * Basic Clicker example using new interfaces and stock component classes.
 */
export class ClickerWithInitialValue extends PrimedComponent implements IComponentHTMLVisual {

    public get IComponentHTMLVisual() { return this; }

    /**
     * Do setup work here
     */
    protected async componentInitializingFirstTime(props?: any) {
        let startingValue = 0;
        if (props && props.initialValue) {
            startingValue = props.initialValue;
        }

        this.root.set("clicks", startingValue, CounterValueType.Name);
    }

    // start IComponentHTMLVisual

    public render(div: HTMLElement) {
        // Get our counter object that we set in initialize and pass it in to the view.
        const counter = this.root.get("clicks");
        ReactDOM.render(
            <CounterReactView map={this.root}counter={counter} />,
            div,
        );
    }

    // end IComponentHTMLVisual

    // ----- COMPONENT SETUP STUFF -----

    // ----- COMPONENT SETUP STUFF -----

    public static getFactory() { return ClickerWithInitialValue.factory; }

    private static readonly factory = new SharedComponentFactory(
        ClickerWithInitialValue,
        [
            SharedMap.getFactory([new CounterValueType()]),
        ],
    );
}

// ----- REACT STUFF -----

interface p {
    map: ISharedMap;
    counter: Counter;
}

interface s {
    value: number;
}

class CounterReactView extends React.Component<p, s> {
    constructor(props: p) {
        super(props);

        this.state = {
            value: this.props.counter.value,
        };
    }

    componentDidMount() {
        // set a listener so when the counter increments we will update our state
        // counter is annoying because it only allows you to register one listener.
        // this causes problems when we have multiple views off the same counter.
        // so we are listening to the map
        this.props.map.on("valueChanged", () => {
            this.setState({ value: this.props.counter.value });
        });
    }

    render() {
        return (
            <div style={{border: "1px dotted red"}}>
                <h3>Clicker With Forge</h3>
                <h5>Forged with initial value of 100. Increments 5.</h5>
                <div>
                    <span>{this.state.value}</span>
                    <button onClick={() => { this.props.counter.increment(5); }}>+5</button>
                </div>
            </div>
        );
    }
}
