function calculate_tax(annual_income) {
    const federal_tax = calculate_federal_tax(annual_income)
    const state_tax = calculate_state_tax(annual_income, federal_tax)

    return federal_tax + state_tax
}

function calculate_federal_tax(annual_income) {
    const taxable_income = annual_income - 50000
    if (taxable_income <= 0) {
        return 0
    }

    if (taxable_income > 150000) {
        return .35 * taxable_income
    }

    if (taxable_income > 100000) {
        return .30 * taxable_income
    }

    if (taxable_income > 50000) {
        return .25 * taxable_income
    }

    return .2 * taxable_income
}

function calculate_state_tax(annual_income, federal_tax) {
    const taxable_income = annual_income - federal_tax - 30000

    if (taxable_income < 0) {
        return 0
    }

    if (taxable_income > 150000) {
        return .15 * taxable_income
    }

    if (taxable_income > 100000) {
        return .10 * taxable_income
    }

    if (taxable_income > 50000) {
        return .05 * taxable_income
    }

    return .01 * taxable_income
}

console.log(calculate_tax(50000))


// 60k total tax
// dependents
