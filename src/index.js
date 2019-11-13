import _ from 'lodash';
import { updateData } from './utils';
import { drawChart } from './chart';

function component() {
    const element = document.createElement('div');

    let state = {
        people: [
            {
                i: 0.09,
                inf: 0.06,
                logAge: 25,
                logRetirementAge: 65,
                logExpenses: 50000,
                logContribution: 30000,
                logSavings: 0,
                timeseries: []
            },
        ]
    };
    state = updateData(state);

    drawChart( state.people[0].timeseries );

    return element;
}

document.body.appendChild(component());