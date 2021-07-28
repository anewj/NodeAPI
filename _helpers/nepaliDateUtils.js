const NepaliDate = require('nepali-date');

// checks request body data for invoice date filter
function checkInput(data){
    switch (data.options.toLowerCase()){
        case "date-range":
            return {startDate: data.startDate, endDate: data.endDate};
        case "yearly":
            if(data.fiscalYear){
                const {year1, year2} = getYears(data.fiscalYear);
                return getDates(year1, year2,3, 2);
            }
            break;
        case "quarterly":
            if(data.fiscalYear){
                const {year1, year2} = getYears(data.fiscalYear);
                if(data.quarter){
                    switch (data.quarter.toUpperCase()) {
                        case "Q1":
                            return getDates(year1, year1,3, 5);
                        case "Q2":
                            return getDates(year1, year1,6, 8);
                        case "Q3":
                            return getDates(year1, year1,9, 11);
                        case "Q4":
                            return getDates(year2, year2,0, 2);
                    }
                }
            }
            break;
        case "half-yearly":
            if(data.fiscalYear){
                const {year1, year2} = getYears(data.fiscalYear);
                if(data.half){
                    switch (data.half.toUpperCase()){
                        case "H1":
                            return getDates(year1,year1,3,8);
                        case "H2":
                            return getDates(year1,year2,9,2)
                    }
                }
            }
            break;
        case "month":
            let start_date = new NepaliDate();
            start_date.setDate(1);
            let end_date = new NepaliDate();
            end_date.setDate(35);
            end_date.setDate(0);
            return {startDate: start_date.format('YYYY/MM/DD'), endDate: end_date.format('YYYY/MM/DD')};
    }
}

//gets start and end dates from first day of startMonth of year1 to last day of endMonth of year2
function getDates(year1, year2, startMonth, endMonth){
    let start_date = new NepaliDate(year1);
    start_date.setMonth(startMonth);
    let end_date = new  NepaliDate(year2);
    end_date.setMonth(endMonth+1);
    end_date.setDate(0);
    return {startDate: start_date.format('YYYY/MM/DD'), endDate: end_date.format('YYYY/MM/DD')};
}

// splits the fiscalYear field to two years. (eg: 2077/78 to 2077 and 2078)
function getYears(years){
    const year = years.split('/');
    return {year1: year[0], year2: "20"+year[1]};
}

module.exports = {
    NepaliDate,
    checkInput
}