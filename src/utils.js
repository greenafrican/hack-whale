const futureValue = ( amount, r, n, t ) => (
    amount * Math.pow( 1 + (r / n), n * t )
);

const annuitise = ( amount, r, n, t ) => {
    return ( amount * ( ( Math.pow( ( 1 + r / n ), ( n * t ) ) - 1 ) / ( r / n ) ) );
};

const addYear = ( theDate, years ) => {
    let copiedDate = new Date(theDate.getTime());
    return new Date( copiedDate.setYear( copiedDate.getFullYear() + years) );
};

const addMonth = ( theDate, months ) => {
    let copiedDate = new Date( theDate.getTime() );
    return new Date( copiedDate.setMonth( copiedDate.getMonth() + months ) );
}

const generateTimeseries = ( person ) => {
    const startDate = new Date(Date.now());
    const endDate = addYear( startDate, ( person.logRetirementAge - person.logAge ) + ( 90-person.logRetirementAge ) );
    const retireDate = addYear(startDate, ( person.logRetirementAge - person.logAge ) );
    let theDate = new Date;
    let rollingBurn = 0;
    let rollingSavings = person.logSavings;
    const monthSeries = [];
    for (let k = 1; theDate <= endDate; k++) {
        theDate = addMonth( startDate, k );

        const thisMonthBurn = (theDate > retireDate) ? futureValue(person.logExpenses, person.inf, 12, k / 12) : 0;
        const thisMonthAnnuity = (theDate <= retireDate) ? futureValue(person.logContribution, person.i, 12, 1 / 12) : 0;
        const thisMonthRolling = futureValue(rollingSavings, person.i, 12, 1 / 12);

        rollingSavings = thisMonthRolling + thisMonthAnnuity - thisMonthBurn;

        monthSeries.push(
            {
                date: theDate,
                rollingSavings,
                thisMonthBurn, // for debugging
                rollingBurn, // for debugging
                fixed: futureValue(person.logSavings, person.i, 12, k / 12), // for debugging
                monthly: annuitise(person.logSavings, person.i, 12, k / 12), // for debugging
            }
        );
    }
    return monthSeries;
};

export const updateData = ( state ) => {
    const updatedPeople = [];
    state.people.forEach( ( person, i ) => {
        updatedPeople.push( Object.assign( {}, person, { 
            timeseries: generateTimeseries( person ).map( d => (
                { date: d.date, value: d.rollingSavings }
            ) )
        } ) );
    } );
    return Object.assign({}, state, { people: updatedPeople });
};
