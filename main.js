const million = 1000 * 1000
const nonTaxableIncome = 50 * million
const MARRIAGE_STATUS = {
    SINGLE: 'Lajang',
    MARRIED: 'Menikah',
    DIVORCED: 'Cerai'
}

const TAX_INCENTIVES = {
    MARRIED: 10 * million,
    SINGLE_PARENTS: 20 * million,
    PER_CHILD: 15 * million
}

function calculateTax(taxYear, name, annualIncome, marriageStatus, dependentChildrenCount) {
    console.log(annualIncome)
    let taxDeduction = nonTaxableIncome
    
    if (marriageStatus == MARRIAGE_STATUS.MARRIED) {
        taxDeduction += TAX_INCENTIVES.MARRIED
    } else if (marriageStatus != MARRIAGE_STATUS.MARRIED && dependentChildrenCount > 0) {
        taxDeduction += TAX_INCENTIVES.SINGLE_PARENTS
    }

    taxDeduction += (dependentChildrenCount * TAX_INCENTIVES.PER_CHILD)

    const taxableIncome = annualIncome - taxDeduction


    if (taxableIncome <= 0) {
        return 0
    }

    if (taxableIncome < 200 * million) {
        return taxableIncome * .10
    }
    if (taxableIncome < 450 * million) {
        return taxableIncome * .15
    }
    return taxableIncome * .20
}
