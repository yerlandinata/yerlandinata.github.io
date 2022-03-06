const million = 1000 * 1000
const nonTaxableIncome = 50 * million

function calculateTax(taxYear, name, annualIncome, marriageStatus, dependentChildrenCount) {
    console.log(annualIncome)
    const taxableIncome = annualIncome - nonTaxableIncome

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
