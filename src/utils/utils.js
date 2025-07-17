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
// writeScheduleToFile(schedule, 'schedule.json');

/**
 * Преизчислява погасителен план при частично предсрочно погасяване.
 * Запазва първоначалната анюитетна вноска и скъсява срока на заема.
 * @param {Array} schedule - Оригиналният погасителен план
 * @param {number} month - Месецът, в който се прави предсрочното погасяване (1-базирано)
 * @param {number} prepaymentAmount - Сума на частичното предсрочно погасяване
 * @param {number} apr - Годишен процент на разходите (ГПР) в проценти
 * @returns {Array} Нов погасителен план от момента на погасяването нататък
 */
function recalculateScheduleWithPrepayment(schedule, month, prepaymentAmount, apr) {
    if (month < 1 || month > schedule.length || prepaymentAmount <= 0) return schedule;

    // Копираме до месеца на погасяване
    const newSchedule = schedule.slice(0, month);

    // Оставаща главница след плащането за този месец
    let remaining = schedule[month - 1].remaining - prepaymentAmount;
    if (remaining <= 0) return newSchedule;

    // Оригиналната месечна вноска
    const originalPayment = schedule[0].payment;
    const monthlyRate = apr / 100 / 12;

    // Изчисляваме новия срок с формулата за анюитет
    let newPeriod;
    if (monthlyRate === 0) {
        newPeriod = Math.ceil(remaining / originalPayment);
    } else {
        newPeriod = Math.ceil(-Math.log(1 - (remaining * monthlyRate) / originalPayment) / Math.log(1 + monthlyRate));
    }

    // Генерираме новия план с оригиналната вноска за новия срок
    const recalculated = [];
    let remainingPrincipal = remaining;

    for (let i = 1; i <= newPeriod; i++) {
        const interest = remainingPrincipal * monthlyRate;
        let principalPayment = originalPayment - interest;
        
        // При последната вноска може да е необходимо да платим по-малко
        if (i === newPeriod) {
            principalPayment = remainingPrincipal;
            const finalPayment = principalPayment + interest;
            recalculated.push({
                month: month + i,
                payment: Number(finalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: 0
            });
        } else {
            recalculated.push({
                month: month + i,
                payment: Number(originalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: Number((remainingPrincipal - principalPayment).toFixed(2))
            });
        }
        
        remainingPrincipal -= principalPayment;
    }

    return newSchedule.concat(recalculated);
}

// 1. Създаваме примерен погасителен план
const originalSchedule = generateAnnuitySchedule(111000, 15 * 12, 4.2);

// 2. Погасяваме предсрочно 3000 лв. след първата месечна вноска
const updatedSchedule = recalculateScheduleWithPrepayment(originalSchedule, 1, 3000, 4.2);

// 3. Записваме двата погасителни плана в 2 файла
writeScheduleToFile(originalSchedule, 'original_schedule.json');
writeScheduleToFile(updatedSchedule, 'updated_schedule.json');