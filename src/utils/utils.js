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
            remaining: Number(remainingPrincipal.toFixed(2)) // Before payment, not after
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
    let remainingBalance = remaining;

    for (let month = 1; month <= newPeriod; month++) {
        const interest = remainingBalance * monthlyRate;
        let principalPayment = originalPayment - interest;
        
        if (month === newPeriod) {
            principalPayment = remainingBalance;
            const finalPayment = principalPayment + interest;
            newSchedule.push({
                month,
                payment: Number(finalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: Number(remainingBalance.toFixed(2)) // Before payment
            });
        } else {
            newSchedule.push({
                month,
                payment: Number(originalPayment.toFixed(2)),
                interest: Number(interest.toFixed(2)),
                principal: Number(principalPayment.toFixed(2)),
                remaining: Number(remainingBalance.toFixed(2)) // Before payment
            });
        }
        
        remainingBalance -= principalPayment;
    }

    return newSchedule;
}


function monthlyPrepay(schedule, prepaymentAmount, apr, total = [{ payments: 0, prepayments: 0, interest: 0, months: 0 }]) {
    if (schedule.length === 0) {
        return total;
    }

    const [currentMonth, ...rest] = schedule;
    
    // Получаваме последните кумулативни стойности или започваме от нула
    const lastTotal = total[total.length - 1]

    // Изчисляваме новите кумулативни стойности
    const newTotal = {
        payments: lastTotal.payments + currentMonth.payment + prepaymentAmount,
        prepayments: lastTotal.prepayments + prepaymentAmount,
        interest: lastTotal.interest + currentMonth.interest,
        months: lastTotal.months + 1
    };

    // Добавяме новия обект към масива
    total.push({
        payments: Number(newTotal.payments.toFixed(2)),
        prepayments: Number(newTotal.prepayments.toFixed(2)),
        interest: Number(newTotal.interest.toFixed(2)),
        months: newTotal.months
    });

    // Погасяваме предсрочно над останалата част от графика
    const newSchedule = applyPrepayment(rest, prepaymentAmount, apr);

    return monthlyPrepay(
        newSchedule,
        prepaymentAmount,
        apr,
        total
    );
}

// Export functions for use in other modules
export { calculateAnnuityPayment, generateAnnuitySchedule, applyPrepayment, monthlyPrepay };
