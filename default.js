function onFormSubmit() {
    document.getElementById('incometax-container').style.visibility = 'visible'
    const incomeTax = calculateTax(
        parseInt(document.getElementById('taxyear').value),
        document.getElementById('name').value,
        parseNumber('income'),
        document.getElementById('marriagestatus').value,
        parseNumber('childrencount'),
    )
    document.getElementById('incometax').value = Number(incomeTax).toString().split( /(?=(?:...)*$)/ ).join(' ')
}

function parseNumber(elementId) {
    let value = document.getElementById(elementId).value.toString()
    if (!value) {
        value = 0
    } else {
        value = value.replaceAll(' ', '')
        value = parseInt(value)
    }
    if (isNaN(value)) {
        value = 0
    }
    return value
}

function onMoneyChange(element) {
    element.value = element.value.split(',')[0]
    if (isNaN(element.value)) {
        return
    }
    element.value = Number(element.value).toString().split( /(?=(?:...)*$)/ ).join(' ')
}

function onMoneyFocus(element) {
    element.value = element.value.replaceAll(' ', '')
}

function onFormChange() {
    document.getElementById('incometax-container').style.visibility = 'hidden'
    document.getElementById('incometax').value = 0
}