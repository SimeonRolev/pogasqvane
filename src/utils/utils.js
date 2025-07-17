/**
 * Изчислява анюитетна месечна вноска по заем.
 * @param {number} principal - Размер на заема (главница)
 * @param {number} periodMonths - Срок на заема в месеци
 * @param {number} apr - Годишен процент на разходите (ГПР) в проценти (напр. 7.5)
 * @returns {number} Месечна анюитетна вноска
 */
function calculateAnnuityPayment(principal, periodMonths, apr) {
    if (periodMonths <= 0 || apr < 0 || principal <= 0) return 0;
    const monthlyRate = apr / 100 / 12;
    if (monthlyRate === 0) return principal / periodMonths;
    const annuity = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -periodMonths));
    return annuity;
}

// module.exports = { calculateAnnuityPayment };

console.log(
    calculateAnnuityPayment(111000, 15 * 12, 4.2)
)