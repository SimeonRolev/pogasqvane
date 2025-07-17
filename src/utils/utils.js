import { writeFileSync } from 'fs';
import { resolve } from 'path';

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

// console.log(calculateAnnuityPayment(111000, 15 * 12, 4.2))

/**
 * Генерира погасителен план по анюитетни вноски.
 * @param {number} principal - Размер на заема (главница)
 * @param {number} periodMonths - Срок на заема в месеци
 * @param {number} apr - Годишен процент на разходите (ГПР) в проценти
 * @returns {Array} Масив с обекти за всяка месечна вноска
 */
function generateAnnuitySchedule(principal, periodMonths, apr) {
    const schedule = [];
    let remainingPrincipal = principal;
    const monthlyRate = apr / 100 / 12;
    const payment = calculateAnnuityPayment(principal, periodMonths, apr);

    for (let month = 1; month <= periodMonths; month++) {
        const interest = remainingPrincipal * monthlyRate;
        const principalPayment = payment - interest;
        schedule.push({
            month,
            payment: Number(payment.toFixed(2)),
            interest: Number(interest.toFixed(2)),
            principal: Number(principalPayment.toFixed(2)),
            remaining: Number((remainingPrincipal - principalPayment).toFixed(2))
        });
        remainingPrincipal -= principalPayment;
    }
    return schedule;
}

const schedule = generateAnnuitySchedule(111000, 15 * 12, 4.2);

/**
 * Записва погасителен план в JSON файл.
 * @param {Array} schedule - Масив с обекти за всяка месечна вноска
 * @param {string} filename - Име на файла за запис
 */
function writeScheduleToFile(schedule, filename) {
    const filePath = resolve(filename);
    writeFileSync(filePath, JSON.stringify(schedule, null, 2), 'utf8');
}

// Пример за използване:
writeScheduleToFile(schedule, 'schedule.json');