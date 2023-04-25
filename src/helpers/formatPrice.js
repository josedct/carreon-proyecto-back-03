const currencyFormat = (num) => {
    return new Intl.NumberFormat('ES-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }
    ).format(num)
}

module.exports = currencyFormat