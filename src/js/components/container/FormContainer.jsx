import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";
import { updateData } from './utils';
import D3Chart from "../d3chart/chart.jsx"

const parameters = [
    {
        id: 'age',
        label: 'Age',
        min: 20,
        max: 80,
        default: 25,
    },
    {
        id: 'retirementAge',
        label: 'Retirement Age',
        min: 20,
        max: 80,
        default: 65,
    },
    {
        id: 'expenses',
        label: 'Monthly Expenses',
        min: 5000,
        max: 500000,
        default: 20000,
    },
    {
        id: 'contributions',
        label: 'Monthly Contribution',
        min: 1000,
        max: 200000,
        default: 5000,
    },
    {
        id: 'savings',
        label: 'Current Savings',
        min: 0,
        max: 100000000,
        default: 100000,
    },
];

class FormContainer extends Component {
    constructor() {
        super();
        this.state = {
            people: [
                {
                    i: 0.09,
                    inf: 0.06,
                    age: 25,
                    retirementAge: 65,
                    expenses: 20000,
                    contributions: 5000,
                    savings: 100000,
                    timeseries: []
                },
            ]
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(personId, param, event) {
        const people = [...this.state.people ];
        people[personId][param] = event.target.value;
        this.setState({ people: updateData(people) });
    }
    render() {
        const { people } = this.state;

        const peopleRanges = people.map( ( person, i ) => (
            parameters.map( param => (
                    <Input
                        text={person[param.id].toString()}
                        label={param.label}
                        type="range"
                        personId={i}
                        paramId={param.id}
                        min={param.min}
                        max={param.max}
                        id={ `${i.toString()}_${param.id}` }
                        key={ `${i.toString()}_${param.id}` }
                        value={person[param.id]}
                        handleChange={this.handleChange}
                    />
            ) )
        ) );
        
        return (
            <div>
                <D3Chart
                    data={people[0].timeseries}
                />
                { peopleRanges.map( ( person, i ) => ( <div key={i}>{ person }</div> ) ) }
            </div>
        );
    }
}
export default FormContainer;

const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;