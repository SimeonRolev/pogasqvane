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

/**
 * Прилага предсрочно погасяване и преизчислява план със скъсен срок.
 * @param {Array} schedule - Текущият погасителен план
 * @param {number} prepaymentAmount - Сума на предсрочното погасяване
 * @param {number} apr - Годишен процент на разходите (ГПР) в проценти
 * @returns {Array} Нов погасителен план със скъсен срок
 */
function applyPrepayment(schedule, prepaymentAmount, apr) {
    if (schedule.length === 0 || prepaymentAmount <= 0) return schedule;

    // Вземаме текущата оставаща главница (от първия месец в плана)
    let remaining = schedule[0].remaining - prepaymentAmount;
    if (remaining <= 0) return []; // Заемът е изплатен напълно

    // Оригиналната месечна вноска
    const originalPayment = schedule[0].payment;
    const monthlyRate = apr / 100 / 12;

    // Изчисляваме новия срок
    let newPeriod;
    if (monthlyRate === 0) {
        newPeriod = Math.ceil(remaining / originalPayment);
    } else {
        newPeriod = Math.ceil(-Math.log(1 - (remaining * monthlyRate) / originalPayment) / Math.log(1 + monthlyRate));
    }

    // Генерираме новия план
    const newSchedule = [];
    let remainingPrincipal = remaining;

    for (let month = 1; month <= newPeriod; month++) {
        const interest = remainingPrincipal * monthlyRate;
        let principalPayment = originalPayment - interest;
        
        if (month === newPeriod) {
            principalPayment = remainingPrincipal;
            const finalPayment = principalPayment + interest;
            newSchedule.push({
                month,
                payment: Number(finalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: 0
            });
        } else {
            newSchedule.push({
                month,
                payment: Number(originalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: Number((remainingPrincipal - principalPayment).toFixed(2))
            });
        }
        
        remainingPrincipal -= principalPayment;
    }

    return newSchedule;
}


function mothlyPrepay(schedule, prepaymentAmount, apr, total = { payments: 0, prepayments: 0, interest: 0, months: 0 }) {
    if (schedule.length === 0 || prepaymentAmount <= 0) return total;

    const [currentMonthEntry, ...rest] = schedule;

    // Плащаме текущата вноска
    total.payments += prepaymentAmount + schedule[0].payment;
    total.prepayments += prepaymentAmount;
    total.interest += currentMonthEntry.interest;
    total.months += 1;

    // Погасяваме предсрочно
    const afterPrepay = applyPrepayment(rest, prepaymentAmount, apr);

    return mothlyPrepay(
        afterPrepay,
        prepaymentAmount,
        apr,
        total
    )
}

const originalSchedule = generateAnnuitySchedule(111000, 15 * 12, 4.2);
console.log(mothlyPrepay(originalSchedule, 3000, 4.2));
