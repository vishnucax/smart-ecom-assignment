function applyDiscount(code, amount) {
    let percentage = 0;

    if (code === 'NEWYEAR') percentage = 10;
    else if (code === 'WELCOME') percentage = 5;

    const discountAmount = (amount * percentage) / 100;

    return {
        discountPercentage: percentage,
        discountAmount,
        finalAmount: amount - discountAmount
    };
}

module.exports = applyDiscount;