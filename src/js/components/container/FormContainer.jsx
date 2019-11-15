import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";
import { getData, updatePeople, getDataAll } from './utils';
import D3Chart from "../d3chart/chart.jsx"
import Lottie from 'react-lottie';
import * as whaleData from './whale.json'

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

const roundIt = (x) => {
    switch (true) {
        case (x < 100):
            return Math.round(x);
        case (x < 1000):
            return Math.round(x / 100) * 100;
        case (x < 10000):
            return Math.round(x / 1000) * 1000;
        case (x < 50000):
            return Math.floor(x / 5000) * 5000;
        case (x < 100000):
            return Math.round(x / 10000) * 10000;
        case (x < 1000000):
            return Math.floor(x / 50000) * 50000;
        case (x >= 1000000):
            return Math.round(x / 100000) * 100000;
    }
}

const logslider = (position, min, max) => {
    const minp = 0;
    const maxp = 100;
    const minv = Math.log(min);
    const maxv = Math.log(max);
    const scale = (maxv - minv) / (maxp - minp);

    return roundIt(Math.exp(minv + scale * (position - minp)));
}

class FormContainer extends Component {
    constructor() {
        super();
        const people = [
            {
                i: 0.09,
                inf: 0.06,
                age: 25,
                retirementAge: 65,
                expenses: 20000,
                contributions: 10000,
                savings: 100000,
                timeseries: []
            }
        ];
        this.state = {
            people,
            dataAll: getDataAll(updatePeople(people))
        };
        this.handleChange = this.handleChange.bind(this);
        this.addPerson = this.addPerson.bind(this);
    }
    addPerson() {
        const copyPerson = Object.assign({}, this.state.people[0]);
        const newPeople = [...this.state.people ];
        newPeople.push(copyPerson);
        const people = updatePeople(newPeople);
        const dataAll = getDataAll(people);
        this.setState({people: newPeople, dataAll});
    }
    handleChange(personId, param, event) {
        const nextPeople = [...this.state.people ];
        nextPeople[personId][param] = parseInt(event.target.value);
        const people = updatePeople(nextPeople);
        const dataAll = getDataAll(people);
        this.setState({ people, dataAll });
    }
    render() {
        const { people, dataAll } = this.state;

        const myStyle = {
            'display': 'flex',
            'flexWrap': 'wrap',
            'justifyContent': 'space-between'
        };

        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: whaleData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

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

        const endNeg = dataAll[dataAll.length - 1];

        let startNeg = dataAll.find((d) => {
            return d.value <= 0;
        }) || endNeg;

        console.log(startNeg.date, endNeg.date);
        
        return (
            <div>
                <D3Chart data={dataAll} />
                <div style={myStyle}>
                    <div>Age</div>
                    <div>Retirement Age</div>
                    <div>Monthly Spending</div>
                    <div>Monthly Contribution</div>
                    <div>Current Savings</div>
                </div>
                { peopleRanges.map( ( person, i ) => ( <div style={myStyle} key={i}>{ person }</div> ) ) }
                <button onClick={this.addPerson}>Add Person</button>
                <Lottie options={defaultOptions}
                    height={400}
                    width={400}/>
            </div>
        );
    }
}
export default FormContainer;

const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;