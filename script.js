let appData = null;
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return num;
    if (Number.isInteger(num) && Math.abs(num) < 1e12) return num.toString();
    let fixed = parseFloat(num.toFixed(3)).toString();
    return fixed.replace('.', ',');
}

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function generateDistractors(correctValue, unit, count = 3) {
    let distractors = [];
    let attempts = 0;
    while (distractors.length < count && attempts < 100) {
        let variant;
        let r = Math.random();
        if (r < 0.33) variant = correctValue * 2;
        else if (r < 0.66) variant = correctValue / 2;
        else variant = correctValue + (Math.random() * 0.5 - 0.25) * correctValue;
        variant = Math.round(variant * 100) / 100;
        if (variant !== correctValue && !distractors.some(d => Math.abs(parseFloat(d) - variant) < 0.0001)) {
            distractors.push(formatNumber(variant) + ' ' + unit);
        }
        attempts++;
    }
    return distractors;
}

// ---------------- Template Handlers ----------------

const templateHandlers = {

    // Q006
    kineticEnergyMassFactor: function () {
        const t = randomFromList([2, 3, 4, 5]);
        const text = `Nếu khối lượng của một vật tăng gấp ${t} nhưng tốc độ giữ nguyên thì động năng của vật sẽ thay đổi như thế nào?`;
        const options = [
            `Tăng gấp ${t} lần`,
            `Không thay đổi`,
            `Giảm đi 1/${t}`,
            `Tăng gấp ${t * t} lần`
        ];
        return { text, options, correct: 0, rationale: `$W_đ = \\frac{1}{2}mv^2$, $W_đ$ tỉ lệ thuận với $m$, nên tăng gấp ${t} lần.` };
    },

    // Q008
    gravitationalPotentialEnergy: function () {
        const m = randomFromList([2, 3, 4, 5]);
        const h = randomFromList([2, 3, 4, 5]);
        const correct = m * 10 * h;
        const text = `Một vật có khối lượng ${m} kg ở độ cao ${h} m so với mặt đất. Chọn gốc thế năng ở mặt đất, hỏi thế năng trọng trường của vật là bao nhiêu?`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$W_t = P.h = 10 \\times ${m} \\times ${h} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q009
    kineticEnergyFromMassSpeed: function () {
        const m = randomFromList([2, 3, 4, 5]);
        const v = randomFromList([2, 3, 4, 5]);
        const correct = 0.5 * m * v * v;
        const text = `Một vật có khối lượng ${m} kg đang chuyển động với tốc độ ${v} m/s. Động năng của vật là bao nhiêu?`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$W_đ = \\frac{1}{2} \\times ${m} \\times ${v}^2 = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q010
    kineticEnergySpeedFactor: function () {
        const t = randomFromList([2, 3, 4, 5]);
        const text = `Động năng của một vật thay đổi như thế nào nếu giữ nguyên khối lượng nhưng tốc độ của vật tăng gấp ${t}?`;
        const options = [
            `Tăng gấp ${t} lần`,
            `Không thay đổi`,
            `Giảm đi 1/${t}`,
            `Tăng gấp ${t * t} lần`
        ];
        return { text, options, correct: 3, rationale: `$W_đ$ tỉ lệ với $v^2$, nên tăng gấp ${t * t} lần.` };
    },

    // Q011
    kineticEnergyBall: function () {
        const m = randomFromList([100, 150, 200, 250, 300]);
        const v = randomFromList([10, 20, 30, 40, 50]);
        const correct = (m * v * v) / 2000;
        const text = `Tính động năng của quả bóng có khối lượng ${m} g, đang bay với tốc độ ${v} m/s.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `Đổi ${m}g = ${m / 1000}kg; $W_đ = \\frac{1}{2} \\times ${m / 1000} \\times ${v}^2 = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q012
    potentialEnergyHeightCm: function () {
        const h = randomFromList([70, 80, 90, 100]);
        const m = randomFromList([15, 20, 25, 30]);
        const correct = m * h / 10;
        const text = `Một kiện hàng được đưa lên cao ${h} cm. Biết khối lượng ${m} kg, tính thế năng trọng trường của kiện hàng.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `Đổi ${h}cm = ${h / 100}m; $W_t = 10 \\times ${m} \\times ${h / 100} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q013
    potentialEnergyWell: function () {
        const P = randomFromList([3, 4, 5, 6]);
        const h = randomFromList([1, 2, 3, 4]);
        const correct = P * (h + 1);
        const text = `Một chiếc hộp có trọng lượng ${P} N được đặt trên thành giếng cao 1 m so với mặt đất. Tính thế năng trọng trường của hộp khi chọn gốc thế năng tại đáy giếng, biết giếng sâu ${h} m.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `Độ cao so với đáy giếng = ${h + 1}m; $W_t = ${P} \\times ${h + 1} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q014
    compareKineticEnergies: function () {
        const m1 = randomFromList([100, 110, 120, 130]);
        const m2 = randomFromList([14, 15, 16, 17]);
        const m4 = randomFromList([6, 8, 10, 12]);
        const v3 = randomFromList([450, 460, 470, 480]);
        const Wta = 50 * m1;
        const Wtb = (m2 * 9) / 2;
        const Wtc = (v3 * v3) / 40;
        const Wtd = 50 * m4;

        const values = [Wta, Wtb, Wtc, Wtd];
        const labels = ['W~ta~', 'W~tb~', 'W~tc~', 'W~td~'];
        const sorted = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
        const orderStr = sorted.map(item => labels[item.i]).join(' < ');

        const options = [
            'W~tb~ < W~td~ < W~ta~ < W~tc~',
            'W~tb~ < W~td~ < W~tc~ < W~ta~',
            'W~ta~ < W~tc~ < W~td~ < W~tb~',
            'W~tc~ < W~ta~ < W~td~ < W~tb~'
        ];
        const correctIdx = options.indexOf(orderStr);
        return {
            text: `So sánh động năng trong các trường hợp: a) Xe máy ${m1}kg v=10m/s; b) Em bé ${m2}kg v=3km/h; c) UAV 500g v=${v3}m/s; d) Thùng hàng ${m4}kg v=10m/s.`,
            options: options,
            correct: correctIdx === -1 ? 0 : correctIdx,
            rationale: `$W_{ta} = ${formatNumber(Wta)}\\text{J}$, $W_{tb} = ${formatNumber(Wtb)}\\text{J}$, $W_{tc} = ${formatNumber(Wtc)}\\text{J}$, $W_{td} = ${formatNumber(Wtd)}\\text{J}$. Sắp xếp: ${orderStr}.`
        };
    },

    // Q015
    bulletHeatEnergy: function () {
        const m = randomFromList([10, 12, 15]);
        const v = randomFromList([300, 400, 500]);
        const correct = (m * v * v) / 2000;
        const text = `Một viên đạn khối lượng ${m}g bắn ngang với vận tốc ${v}m/s, xuyên qua tấm gỗ và dừng lại. Tính nhiệt năng sinh ra, coi toàn bộ động năng chuyển thành nhiệt.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$W_đ = \\frac{1}{2} \\times ${m / 1000} \\times ${v}^2 = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q016
    potentialEnergyDecrease: function () {
        const P = randomFromList([70, 80, 90, 100]);
        const h = randomFromList([5, 6, 7, 8]);
        const z = randomFromList([10, 11, 12, 13, 14, 15]);
        const correct = P * h;
        const text = `Một hộp trọng lượng ${P}N trượt từ đỉnh dốc cao ${h}m, dài ${z}m. Tính độ giảm thế năng khi đến chân dốc (bỏ qua ma sát).`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$\\Delta W_t = P.h = ${P} \\times ${h} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q017
    hailstoneHeight: function () {
        const P = randomFromList([20, 25]);
        const Wt = randomFromList([20000, 25000, 30000]);
        const correct = Wt / P;
        const text = `Viên băng đá trọng lượng ${P}N có thế năng ${Wt}J. Tính độ cao đám mây khi nó bắt đầu rơi.`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' m'), rationale: `$h = W_t / P = ${Wt} / ${P} = ${formatNumber(correct)}\\ \\text{m}$` };
    },

    // Q018
    booksPotentialEnergy: function () {
        const P1 = randomFromList([10, 15, 20, 25]);
        const t = randomFromList([4, 5, 6]);
        const h = randomFromList([5, 6, 7]);
        const correct = P1 * t * 2 * h;
        const text = `Mỗi hộp sách có trọng lượng ${P1}N, thang máy chở ${t} hộp, độ cao mỗi tầng ${h}m. Tính thế năng khi chuyển từ tầng 1 lên tầng 3.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$P = ${P1} \\times ${t} = ${P1 * t}\\text{N}$; $h = 2 \\times ${h} = ${2 * h}\\text{m}$; $W_t = ${P1 * t} \\times ${2 * h} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q019
    slidingObjectPotentialEnergy: function () {
        const m = randomFromList([500, 600, 700, 800]);
        const l = randomFromList([6, 8, 10, 12]);
        const correct = (m * l) / 200;
        const text = `Vật khối lượng ${m}g trượt từ đỉnh dốc dài ${l}m, góc nghiêng 30°. Tính thế năng tại đỉnh dốc.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$h = ${l} \\times \\sin 30^\\circ = ${l / 2}\\text{m}$; $P = 10 \\times ${m / 1000} = ${m / 100}\\text{N}$; $W_t = ${m / 100} \\times ${l / 2} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q030
    maxHeightFromSpeed: function () {
        const v = randomFromList([20, 40, 60]);
        const correct = (v * v) / 20;
        const text = `Một quả bóng được ném thẳng đứng lên cao với vận tốc ban đầu ${v} m/s. Bỏ qua sức cản, độ cao cực đại là bao nhiêu?`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' m'), rationale: `$h = \\dfrac{v^2}{2g} = \\dfrac{${v}^2}{20} = ${formatNumber(correct)}\\ \\text{m}$` };
    },

    // Q031
    speedAtEnergyRatio: function () {
        const v1 = randomFromList([10, 20]);
        const v2 = randomFromList([30, 40]);
        const t = randomFromList([2, 3, 4]);
        const correct = v2 * Math.sqrt(t / (t + 1));
        const text = `Vật ném lên với vận tốc ${v1}m/s từ độ cao h, khi chạm đất vận tốc ${v2}m/s. Tính vận tốc khi động năng bằng ${t} lần thế năng.`;
        const options = generateDistractors(correct, 'm/s');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m/s');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' m/s'), rationale: `$v = v_2 \\times \\sqrt{\\dfrac{${t}}{${t}+1}} = ${formatNumber(correct)}\\ \\text{m/s}$` };
    },

    // Q032
    maxHeightFromImpactSpeed: function () {
        const v = randomFromList([10, 12, 15]);
        const correct = (v * v) / 20;
        const text = `Vật rơi chạm đất với vận tốc ${v}m/s. Tính độ cao cực đại vật đạt được (gốc thế năng tại mặt đất).`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' m'), rationale: `$h = \\dfrac{v^2}{2g} = \\dfrac{${v}^2}{20} = ${formatNumber(correct)}\\ \\text{m}$` };
    },

    // Q033
    averageForceFromDrop: function () {
        const hA = randomFromList([40, 45, 50]);
        const m = randomFromList([50, 100, 200]);
        const hB = randomFromList([5, 10]);
        const correct = (m * hB / 100 + m * hA) / hB;
        const text = `Vật khối lượng ${m}g rơi từ độ cao ${hA}m, lún sâu ${hB}cm trong đất. Tính lực cản trung bình.`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' N'), rationale: `$F_c = ${formatNumber(correct)}\\ \\text{N}$` };
    },

    // Q042
    powerFromForceDistanceTime: function () {
        const F = randomFromList([300, 400, 500, 600]);
        const s = randomFromList([8, 10, 12]);
        const t = randomFromList([0.2, 0.25, 0.5]);
        const correct = (F * s) / (t * 60);
        const text = `Công nhân kéo vật với lực ${F}N lên cao ${s}m trong ${t} phút. Tính công suất.`;
        const options = generateDistractors(correct, 'W');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' W');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' W'), rationale: `$A = ${F} \\times ${s} = ${F * s}\\text{J}$; $t = ${t * 60}\\text{s}$; $\\mathcal{P} = \\dfrac{A}{t} = ${formatNumber(correct)}\\ \\text{W}$` };
    },

    // Q043
    comparePowerLedAC: function () {
        const P1 = randomFromList([2250, 2500, 2750, 3000]);
        const P2 = 9000 * 0.293; // 2637 W
        const text = `So sánh công suất của đèn LED ${P1}W với máy điều hòa 9000 BTU/h.`;
        const options = [
            `$\\mathcal{P}_1 < \\mathcal{P}_2$`,
            `$\\mathcal{P}_1 > \\mathcal{P}_2$`,
            `$\\mathcal{P}_1 = \\mathcal{P}_2$`,
            `Không thể kết luận`
        ];
        let correctIdx = P1 < 2637 ? 0 : (P1 > 2637 ? 1 : 2);
        return { text, options, correct: correctIdx, rationale: `9000 BTU/h = 2637 W. So sánh: ${P1} W ${P1 < 2637 ? '<' : (P1 > 2637 ? '>' : '=')} 2637 W.` };
    },

    // Q044
    workToAccelerateCar: function () {
        const m = randomFromList([1000, 1200, 1500]);
        const v = randomFromList([15, 20, 25]);
        const correct = 0.5 * m * v * v;
        const text = `Xe khối lượng ${m}kg tăng tốc từ 0 lên ${v}m/s. Tính công cần thiết.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$A = W_đ = \\dfrac{1}{2} \\times ${m} \\times ${v}^2 = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q045
    comparePowerLedHP: function () {
        const P1 = randomFromList([2250, 2500, 2750, 3000]);
        const P2 = 3.5 * 746; // 2611 W
        const text = `So sánh công suất của đèn LED ${P1}W với máy điều hòa 3,5 HP.`;
        const options = [
            `$\\mathcal{P}_1 < \\mathcal{P}_2$`,
            `$\\mathcal{P}_1 > \\mathcal{P}_2$`,
            `$\\mathcal{P}_1 = \\mathcal{P}_2$`,
            `Không thể kết luận`
        ];
        let correctIdx = P1 < 2611 ? 0 : (P1 > 2611 ? 1 : 2);
        return { text, options, correct: correctIdx, rationale: `3,5 HP = 2611 W. So sánh: ${P1} W ${P1 < 2611 ? '<' : (P1 > 2611 ? '>' : '=')} 2611 W.` };
    },

    // Q046
    workFromPowerTime: function () {
        const P = randomFromList([1000, 1500, 2000, 2500]);
        const t = randomFromList([1, 1.5, 2, 2.5]);
        const correct = P * t * 3600;
        const text = `Máy bơm công suất ${P}W hoạt động ${t}h. Tính tổng công.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$A = \\mathcal{P} \\times t = ${P} \\times ${t * 3600} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q047
    totalWorkLiftCarry: function () {
        const m = randomFromList([5, 6, 7, 8]);
        const h1 = randomFromList([1, 2, 3, 4]);
        const s = randomFromList([20, 25, 30, 35]);
        const correct = 10 * m * (h1 + s);
        const text = `Người nhấc vật ${m}kg lên cao ${h1}m rồi mang đi ngang ${s}m. Tính tổng công.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$A = 10 \\times ${m} \\times (${h1}+${s}) = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q048
    workBricks: function () {
        const t = randomFromList([200, 250, 300]);
        const m = randomFromList([2, 2.5, 3]);
        const h = randomFromList([6, 8, 10]);
        const correct = 10 * t * m * h;
        const text = `Cần đưa ${t} viên gạch, mỗi viên ${m}kg lên cao ${h}m. Tính tổng công.`;
        const options = generateDistractors(correct, 'J');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' J');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' J'), rationale: `$A = 10 \\times ${t} \\times ${m} \\times ${h} = ${formatNumber(correct)}\\ \\text{J}$` };
    },

    // Q050
    elevatorCost: function () {
        const t = randomFromList([9, 10, 11, 12]);
        const h1 = randomFromList([3.3, 3.4, 3.5, 3.6]);
        const correct = 55 * h1 * (t - 1) / 3;
        const text = `Tòa nhà ${t} tầng, mỗi tầng cao ${h1}m, thang chở 20 người (50kg/người), mất 60s, động cơ công suất gấp đôi, giá điện 3300đ/kWh. Tính chi phí mỗi lần lên tầng ${t}.`;
        const options = generateDistractors(correct, 'đồng');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' đồng');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' đồng'), rationale: `Chi phí = ${formatNumber(correct)} đồng.` };
    },

    // Q064
    refractionAngleFromAir: function () {
        const materials = Object.keys(appData.refractiveIndices);
        const name = randomPick(materials);
        const n2 = appData.refractiveIndices[name];
        const i = randomFromList([10, 20, 30, 40, 50, 60, 70, 80]);
        const correct = Math.asin(Math.sin(i * Math.PI / 180) / n2) * 180 / Math.PI;
        const text = `Chiếu tia sáng từ không khí tới mặt ${name} với góc tới ${i}°. Biết chiết suất của ${name} là ${n2}. Tính góc khúc xạ r.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$\\sin r = \\dfrac{\\sin i}{n_2} = \\dfrac{\\sin${i}^\\circ}{${n2}}$; $r = ${formatNumber(correct)}^\\circ$` };
    },

    // Q065
    sunAngleUnderwater: function () {
        const r_deg = randomFromList([10, 20, 30, 40, 50, 60, 70, 80]);
        const n = 4 / 3;
        const i_deg = Math.asin(n * Math.sin(r_deg * Math.PI / 180)) * 180 / Math.PI;
        const correct = 90 - i_deg;
        const text = `Thợ lặn thấy Mặt Trời ở độ cao ${90 - r_deg}° so với đường chân trời. Chiết suất nước ${n}. Tính góc tạo bởi tia sáng Mặt Trời với đường chân trời.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$r = ${r_deg}^\\circ$; $\\sin i = n \\sin r$; $\\alpha = 90^\\circ - i = ${formatNumber(correct)}^\\circ$` };
    },

    // Q066
    refractionReversible: function () {
        const i1 = randomFromList([10, 20, 30, 40, 45]);
        let r1 = randomFromList([20, 30, 40, 45, 50, 60, 70, 80]);
        while (r1 <= i1) r1 = randomFromList([20, 30, 40, 45, 50, 60, 70, 80]);
        const i2 = randomFromList([10, 20, 30, 40, 45, 50, 60, 70, 80]);
        const correct = Math.asin(Math.sin(i2 * Math.PI / 180) * Math.sin(r1 * Math.PI / 180) / Math.sin(i1 * Math.PI / 180)) * 180 / Math.PI;
        const text = `Tia sáng từ chất lỏng ra không khí: $i_1=${i1}^\\circ$, $r_1=${r1}^\\circ$. Khi chiếu từ không khí vào chất lỏng với $i_2=${i2}^\\circ$, tính góc khúc xạ.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$\\sin r_2 = \\dfrac{\\sin i_2 \\cdot \\sin r_1}{\\sin i_1} = ${formatNumber(correct)}^\\circ$` };
    },

    // Q067
    cubeMaxIncidentAngle: function () {
        const t = randomFromList([1.25, 1.5, 1.75]);
        const correct = Math.asin(t * Math.sin(35.26 * Math.PI / 180)) * 180 / Math.PI;
        const text = `Khối lập phương chiết suất ${t}. Tìm góc tới lớn nhất để tia khúc xạ còn gặp mặt đáy.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$\\tan r = \\dfrac{\\sqrt{2}}{2} \\Rightarrow r = 35.26^\\circ$; $\\sin i = n \\sin r \\Rightarrow i = ${formatNumber(correct)}^\\circ$` };
    },

    // Q068
    refractiveIndexFromAngles: function () {
        const i = randomFromList([10, 20, 30, 40, 45]);
        let r = randomFromList([20, 30, 40, 45, 50, 60, 70, 80]);
        while (r <= i) r = randomFromList([20, 30, 40, 45, 50, 60, 70, 80]);
        const correct = Math.sin(r * Math.PI / 180) / Math.sin(i * Math.PI / 180);
        const text = `Tia sáng từ chất lỏng ra không khí: góc tới ${i}°, góc khúc xạ ${r}°. Tính chiết suất của chất lỏng.`;
        const options = generateDistractors(correct, '');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct));
        return { text, options, correct: options.indexOf(formatNumber(correct)), rationale: `$n = \\dfrac{\\sin r}{\\sin i} = ${formatNumber(correct)}$` };
    },

    // Q069
    lakeDepthFromApparent: function () {
        const d_anh = randomFromList([0.34, 0.44, 0.54, 0.64]) * 3;
        const correct = 4 * d_anh / 3;
        const text = `Người nhìn hòn sỏi dưới đáy hồ thấy cách mặt nước ${d_anh}m. Chiết suất nước 4/3. Tính độ sâu thực của hồ.`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' m'), rationale: `$h = \\dfrac{4}{3} \\times d_{\\text{ảnh}} = ${formatNumber(correct)}\\ \\text{m}$` };
    },

    // Q080
    minimumRadiusForTotalReflection: function () {
        const h = randomFromList([20, 40, 60, 80, 100]);
        const correct = h / Math.sqrt((4 / 3) * (4 / 3) - 1);
        const text = `Bể nước sâu ${h}cm, nguồn sáng ở đáy. Tính bán kính tối thiểu của tấm gỗ trên mặt nước để không có tia sáng lọt ra ngoài.`;
        const options = generateDistractors(correct, 'cm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' cm');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' cm'), rationale: `$R_{\\min} = \\dfrac{h}{\\sqrt{n^2-1}} = ${formatNumber(correct)}\\ \\text{cm}$` };
    },

    // Q086
    criticalAngle: function () {
        const materials = Object.keys(appData.refractiveIndices);
        const name = randomPick(materials);
        const n = appData.refractiveIndices[name];
        const correct = Math.asin(1 / n) * 180 / Math.PI;
        const text = `Tia sáng từ ${name} (chiết suất ${n}) ra không khí. Tính góc giới hạn phản xạ toàn phần.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$\\sin i_{gh} = \\dfrac{1}{n} = \\dfrac{1}{${n}}$ \\Rightarrow $i_{gh} = ${formatNumber(correct)}^\\circ$` };
    },

    // Q098
    prismAngleFromTriangle: function () {
        const a = randomFromList([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
        const text = `Lăng kính tam giác vuông ABC, góc B = ${a}°. Xác định góc chiết quang.`;
        const options = [
            `${a}°`,
            `90°`,
            `${90 - a}°`,
            `Có thể là ${a}°, 90° hoặc ${90 - a}° tùy đường truyền`
        ];
        return { text, options, correct: 3, rationale: `Góc chiết quang phụ thuộc vào mặt bên được chọn, có thể là A, B hoặc C.` };
    },

    // Q110
    prismDeviation: function () {
        const a = randomFromList([20, 30, 40, 50, 60]);
        const i1 = randomFromList([30, 40, 50, 60, 70, 80]);
        const n = 1.5;
        const r1 = Math.asin(Math.sin(i1 * Math.PI / 180) / n);
        const i2 = (a * Math.PI / 180) - r1;
        const r2 = Math.asin(n * Math.sin(i2));
        const D = (r2 + i1 * Math.PI / 180 - a * Math.PI / 180) * 180 / Math.PI;
        const correct = D;
        const text = `Lăng kính A = ${a}°, n = 1.5, chiếu tia với i1 = ${i1}°. Tính góc lệch D.`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$D = ${formatNumber(correct)}^\\circ$` };
    },

    // Q112
    prismTotalInternalReflection: function () {
        const i1 = randomFromList([30, 40, 50, 60, 70, 80, 90]);
        const n = Math.sqrt(2);
        const r1 = Math.asin(Math.sin(i1 * Math.PI / 180) / n);
        const i2 = (60 * Math.PI / 180) - r1;
        const r2 = Math.asin(n * Math.sin(i2));
        const correct = r2 * 180 / Math.PI;
        const text = `Lăng kính tam giác đều n = √2, chiếu tia với i1 = ${i1}°. Xác định đường truyền (góc khúc xạ r2).`;
        const options = generateDistractors(correct, '°');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + '°');
        return { text, options, correct: options.indexOf(formatNumber(correct) + '°'), rationale: `$r_2 = ${formatNumber(correct)}^\\circ$` };
    },

    // Q134
    lensImageDistanceHeight_Real: function () {
        const h = randomFromList([8, 16, 32, 64]);
        const f = randomFromList([5, 6, 7, 8, 9]) * 2;
        const d = f * 3;
        const d_prime = (f * d) / (d - f);
        const h_prime = (f * h) / (d - f);
        const text = `Thấu kính hội tụ f = ${f}cm, vật cao ${h}cm, d = ${d}cm. Tính d' và h' (ảnh thật).`;
        const options = [
            `$d' = ${formatNumber(d_prime)}$ cm, $h' = ${formatNumber(h_prime)}$ cm`,
            `$d' = ${formatNumber(d_prime * 2)}$ cm, $h' = ${formatNumber(h_prime * 2)}$ cm`,
            `$d' = ${formatNumber(d_prime / 2)}$ cm, $h' = ${formatNumber(h_prime / 2)}$ cm`,
            `$d' = ${formatNumber(d_prime + 1)}$ cm, $h' = ${formatNumber(h_prime + 1)}$ cm`
        ];
        return { text, options, correct: 0, rationale: `Áp dụng định lý đồng dạng: <details><summary>📐 Xem chứng minh công thức $\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{d'}$</summary><p>$\\Delta v. OA'B' \\sim \\Delta v. OAB$ (góc vuông – góc nhọn đối đỉnh):</p><p>$\\dfrac{A'B'}{AB} = \\dfrac{OA'}{OA}$ &nbsp; (1)</p><p>$\\Delta v. A'B'F' \\sim \\Delta v. OIF'$ (góc vuông – góc nhọn đối đỉnh):</p><p>$\\dfrac{A'B'}{OI} = \\dfrac{A'F'}{OF'}$</p><p>Vì $OI = AB$ nên $\\dfrac{A'B'}{AB} = \\dfrac{A'F'}{OF'} = \\dfrac{OA' - OF'}{OF'}$ &nbsp; (2)</p><p>Từ (1) và (2) ta được: $\\dfrac{OA'}{OA} = \\dfrac{OA' - OF'}{OF'}$</p><p>$\\Rightarrow \\dfrac{d'}{d} = \\dfrac{d' - f}{f} \\Rightarrow d' = \\dfrac{f \\cdot d}{d - f}$</p><p>Với $d = 3f$, ta có $d' = \\dfrac{f \\cdot 3f}{3f - f} = \\dfrac{3f^2}{2f} = 1.5f$ và $h' = \\dfrac{f \\cdot h}{d - f}$.</p></details>` };
    },

    // Q135
    lensImageDistanceHeight_Virtual: function () {
        const h = randomFromList([8, 16, 32, 64]);
        const f = randomFromList([5, 6, 7, 8, 9]) * 3;
        const d = f * 2 / 3;
        const d_prime_abs = (f * d) / (f - d);
        const h_prime = (f * h) / (f - d);
        const text = `Thấu kính hội tụ f = ${f}cm, vật cao ${h}cm, d = ${d}cm (d < f). Tính |d'| và h' (ảnh ảo).`;
        const options = [
            `$|d'| = ${formatNumber(d_prime_abs)}$ cm, $h' = ${formatNumber(h_prime)}$ cm`,
            `$|d'| = ${formatNumber(d_prime_abs * 2)}$ cm, $h' = ${formatNumber(h_prime * 2)}$ cm`,
            `$|d'| = ${formatNumber(d_prime_abs / 2)}$ cm, $h' = ${formatNumber(h_prime / 2)}$ cm`,
            `$|d'| = ${formatNumber(d_prime_abs + 1)}$ cm, $h' = ${formatNumber(h_prime + 1)}$ cm`
        ];
        return { text, options, correct: 0, rationale: `Áp dụng định lý đồng dạng (ảnh ảo): <details><summary>📐 Xem chứng minh công thức</summary><p>$\\Delta v. OA'B' \\sim \\Delta v. OAB$ (góc vuông – góc nhọn chung):</p><p>$\\dfrac{A'B'}{AB} = \\dfrac{OA'}{OA}$ &nbsp; (1)</p><p>$\\Delta v. A'B'F' \\sim \\Delta v. OIF'$ (góc vuông – góc nhọn chung):</p><p>$\\dfrac{A'B'}{OI} = \\dfrac{A'F'}{OF'} = \\dfrac{OA' + OF'}{OF'}$ &nbsp; (2)</p><p>Vì $OI = AB$ nên từ (1) và (2): $\\dfrac{OA'}{OA} = \\dfrac{OA' + OF'}{OF'}$</p><p>$\\Rightarrow \\dfrac{|d'|}{d} = \\dfrac{|d'| + f}{f} \\Rightarrow |d'| = \\dfrac{f \\cdot d}{f - d}$</p></details>` };
    },

    // Q136
    lensVirtualImageConvex: function () {
        const f = randomFromList([5, 6, 7, 8, 9]) * 3;
        const d = f * 2 / 3;
        const text = `Thấu kính hội tụ f = ${f}cm, d = ${d}cm. Nhận xét về ảnh.`;
        const options = [
            `Ảnh thật, ngược chiều, lớn hơn vật`,
            `Ảnh ảo, cùng chiều, lớn hơn vật`,
            `Ảnh ảo, cùng chiều, nhỏ hơn vật`,
            `Không tạo ảnh`
        ];
        return { text, options, correct: 1, rationale: `Vì $d < f$, ảnh ảo, cùng chiều, lớn hơn vật.` };
    },

    // Q137
    lensVirtualImageConcave: function () {
        const f = randomFromList([5, 6, 7, 8, 9]) * 3;
        const d = f * 2 / 3;
        const text = `Thấu kính phân kì f = ${f}cm, d = ${d}cm. Nhận xét về ảnh.`;
        const options = [
            `Ảnh thật, ngược chiều, lớn hơn vật`,
            `Ảnh ảo, cùng chiều, lớn hơn vật`,
            `Ảnh ảo, cùng chiều, nhỏ hơn vật`,
            `Không tạo ảnh`
        ];
        return { text, options, correct: 2, rationale: `Thấu kính phân kì luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật.` };
    },

    // Q141
    lensConvexImageReal: function () {
        const h = randomFromList([5, 6, 7, 8, 9]);
        const f = randomFromList([1, 2, 3, 4, 5]) * 3;
        const d = f * 4 / 3;
        const d_prime = (f * d) / (d - f);
        const h_prime = (f * h) / (d - f);
        const text = `Thấu kính hội tụ f = ${f}cm, vật cao ${h}cm, d = ${d}cm. Tính d' và h'.`;
        const options = [
            `$d' = ${formatNumber(d_prime)}$ cm, $h' = ${formatNumber(h_prime)}$ cm`,
            `$d' = ${formatNumber(d_prime * 2)}$ cm, $h' = ${formatNumber(h_prime * 2)}$ cm`,
            `$d' = ${formatNumber(d_prime / 2)}$ cm, $h' = ${formatNumber(h_prime / 2)}$ cm`,
            `$d' = ${formatNumber(d_prime + 1)}$ cm, $h' = ${formatNumber(h_prime + 1)}$ cm`
        ];
        return { text, options, correct: 0, rationale: `Áp dụng công thức thấu kính: <details><summary>📐 Xem chứng minh chi tiết</summary><p>$\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{d'}$</p><p>Với $d = \\dfrac{4}{3}f$, ta có:</p><p>$\\dfrac{1}{d'} = \\dfrac{1}{f} - \\dfrac{1}{4f/3} = \\dfrac{1}{f} - \\dfrac{3}{4f} = \\dfrac{1}{4f} \\Rightarrow d' = 4f$</p><p>Độ phóng đại: $k = \\dfrac{h'}{h} = \\dfrac{d'}{d} = \\dfrac{4f}{4f/3} = 3$</p></details>` };
    },

    // Q142
    lensConvexObjectImagePositions: function () {
        const f = randomFromList([1, 2, 3, 4, 5]) * 4;
        const L = f * 25 / 4;
        const delta = Math.sqrt(L * L - 4 * L * f);
        const d1 = (L + delta) / 2;
        const d2 = (L - delta) / 2;
        const d1p = L - d1;
        const d2p = L - d2;
        const text = `Thấu kính hội tụ f = ${f}cm, ảnh cách vật L = ${L}cm. Xác định vị trí vật và ảnh.`;
        const options = [
            `$d = ${formatNumber(d1)}$ cm, $d' = ${formatNumber(d1p)}$ cm hoặc $d = ${formatNumber(d2)}$ cm, $d' = ${formatNumber(d2p)}$ cm`,
            `$d = ${formatNumber(d1)}$ cm, $d' = ${formatNumber(d1p)}$ cm`,
            `$d = ${formatNumber(d2)}$ cm, $d' = ${formatNumber(d2p)}$ cm`,
            `Không có nghiệm`
        ];
        return { text, options, correct: 0, rationale: `Sử dụng công thức thấu kính và điều kiện $d + d' = L$: <details><summary>📐 Xem chứng minh</summary><p>Từ $\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{d'}$ và $d' = L - d$:</p><p>$\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{L-d} = \\dfrac{L}{d(L-d)}$</p><p>$\\Rightarrow d(L-d) = fL \\Rightarrow d^2 - Ld + fL = 0$</p><p>Giải phương trình bậc hai, với $L = \\dfrac{25}{4}f$, ta được hai nghiệm:</p><p>$d_1 = 5f,\\, d'_1 = \\dfrac{5}{4}f$</p><p>$d_2 = \\dfrac{5}{4}f,\\, d'_2 = 5f$</p></details>` };
    },

    // Q143
    lensImageShift: function () {
        const f = randomFromList([1, 2, 3, 4, 5]) * 2;
        const d = f * 2;
        const s = randomFromList([2, 4, 6, 8, 10]);
        const s_prime = s * f / (d - f);
        const text = `Thấu kính hội tụ f = ${f}cm, d = ${d}cm, vật dịch ngang ${s}cm. Tính độ dịch chuyển của ảnh.`;
        const options = generateDistractors(s_prime, 'cm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(s_prime) + ' cm');
        return { text, options, correct: options.indexOf(formatNumber(s_prime) + ' cm'), rationale: `Từ công thức thấu kính và tỉ lệ đồng dạng: <details><summary>📐 Xem chứng minh</summary><p>Khi vật dịch ngang một đoạn $s$, ảnh dịch ngang một đoạn $s'$.</p><p>Ta có: $\\dfrac{s'}{s} = \\dfrac{d'}{d}$ (do tam giác đồng dạng).</p><p>Với $d' = \\dfrac{f \\cdot d}{d - f}$, ta được:</p><p>$s' = s \\cdot \\dfrac{d'}{d} = s \\cdot \\dfrac{f}{d - f}$</p></details>` };
    },

    // Q157
    magnifyingPowerFocalLength: function () {
        const G = randomFromList([2, 5, 10, 20]);
        const correct = 25 / G;
        const text = `Kính lúp có số bội giác G = ${G}x. Tính tiêu cự.`;
        const options = generateDistractors(correct, 'cm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' cm');
        return { text, options, correct: options.indexOf(formatNumber(correct) + ' cm'), rationale: `$f = \\dfrac{25}{G} = \\dfrac{25}{${G}} = ${formatNumber(correct)}\\ \\text{cm}$` };
    },

    // Q159
    magnifyingGlassImageSize: function () {
        const G = randomFromList([2, 5, 10, 20]);
        const h = randomFromList([0.1, 0.2, 0.3, 0.4, 0.5]);
        const correct_d = 25 * 9 / G;
        const correct_d_abs = 250 * 9 / G;
        const text = `Kính lúp G = ${G}x, vật cao ${h}mm. Muốn ảnh cao ${10 * h}mm, tính khoảng cách vật và ảnh.`;
        const options = [
            `$d = ${formatNumber(correct_d)}$ mm, $|d'| = ${formatNumber(correct_d_abs)}$ mm`,
            `$d = ${formatNumber(correct_d * 2)}$ mm, $|d'| = ${formatNumber(correct_d_abs * 2)}$ mm`,
            `$d = ${formatNumber(correct_d / 2)}$ mm, $|d'| = ${formatNumber(correct_d_abs / 2)}$ mm`,
            `$d = ${formatNumber(correct_d + 1)}$ mm, $|d'| = ${formatNumber(correct_d_abs + 1)}$ mm`
        ];
        return { text, options, correct: 0, rationale: `$d = \\dfrac{25 \\times 9}{G} = ${formatNumber(correct_d)}\\ \\text{mm}$; $|d'| = \\dfrac{250 \\times 9}{G} = ${formatNumber(correct_d_abs)}\\ \\text{mm}$` };
    },

    // Q160
    lensConvexImageProperties: function () {
        const h = randomFromList([1, 2, 4, 8, 16]);
        const f = randomFromList([1, 2, 3, 4, 5, 6]) * 2;
        const d = f * 1.5;
        const d_prime = (f * d) / (d - f);
        const h_prime = (f * h) / (d - f);
        const text = `Thấu kính hội tụ f = ${f}cm, d = ${d}cm, vật cao ${h}cm. Tính d', h' và nhận xét.`;
        const options = [
            `$d' = ${formatNumber(d_prime)}$ cm, $h' = ${formatNumber(h_prime)}$ cm (ảnh thật, ngược chiều)`,
            `$d' = ${formatNumber(d_prime)}$ cm, $h' = ${formatNumber(h_prime)}$ cm (ảnh ảo, cùng chiều)`,
            `$d' = ${formatNumber(d_prime * 2)}$ cm, $h' = ${formatNumber(h_prime * 2)}$ cm (ảnh thật, ngược chiều)`,
            `$d' = ${formatNumber(d_prime / 2)}$ cm, $h' = ${formatNumber(h_prime / 2)}$ cm (ảnh ảo, cùng chiều)`
        ];
        return { text, options, correct: 0, rationale: `Áp dụng công thức thấu kính: <details><summary>📐 Xem chứng minh</summary><p>$\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{d'}$</p><p>Với $d = 1.5f$, ta có:</p><p>$\\dfrac{1}{d'} = \\dfrac{1}{f} - \\dfrac{1}{1.5f} = \\dfrac{1}{f} - \\dfrac{2}{3f} = \\dfrac{1}{3f} \\Rightarrow d' = 3f$</p><p>Độ phóng đại: $k = \\dfrac{d'}{d} = \\dfrac{3f}{1.5f} = 2$</p><p>Ảnh thật, ngược chiều, cao gấp 2 lần vật.</p></details>` };
    },

    // Q161
    lensConcaveImageProperties: function () {
        const h = randomFromList([6, 12, 18, 24, 30]);
        const f = randomFromList([1, 2, 3, 4, 5]) * 3;
        const d = 2 * f;
        const d_prime_abs = (f * d) / (d + f);
        const h_prime = (f * h) / (d + f);
        const text = `Thấu kính phân kì f = ${f}cm, d = ${d}cm, vật cao ${h}cm. Tính |d'| và h'.`;
        const options = [
            `$|d'| = ${formatNumber(d_prime_abs)}$ cm, $h' = ${formatNumber(h_prime)}$ cm (ảnh ảo, cùng chiều, nhỏ hơn vật)`,
            `$|d'| = ${formatNumber(d_prime_abs)}$ cm, $h' = ${formatNumber(h_prime)}$ cm (ảnh thật, ngược chiều)`,
            `$|d'| = ${formatNumber(d_prime_abs * 2)}$ cm, $h' = ${formatNumber(h_prime * 2)}$ cm (ảnh ảo, cùng chiều)`,
            `$|d'| = ${formatNumber(d_prime_abs / 2)}$ cm, $h' = ${formatNumber(h_prime / 2)}$ cm (ảnh ảo, cùng chiều)`
        ];
        return { text, options, correct: 0, rationale: `Với thấu kính phân kì, công thức thấu kính vẫn đúng nhưng $f$ mang dấu âm: <details><summary>📐 Xem chứng minh</summary><p>$\\dfrac{1}{f} = \\dfrac{1}{d} + \\dfrac{1}{d'}$ (với $f<0$)</p><p>Thay $f = -|f|$, $d = 2|f|$:</p><p>$\\dfrac{1}{-|f|} = \\dfrac{1}{2|f|} + \\dfrac{1}{d'} \\Rightarrow \\dfrac{1}{d'} = -\\dfrac{1}{|f|} - \\dfrac{1}{2|f|} = -\\dfrac{3}{2|f|}$</p><p>$\\Rightarrow d' = -\\dfrac{2}{3}|f|$ (ảnh ảo, cùng phía với vật)</p><p>$|d'| = \\dfrac{2}{3}f$, $h' = \\dfrac{|d'|}{d} \\cdot h = \\dfrac{2f/3}{2f} \\cdot h = \\dfrac{h}{3}$</p></details>` };
    },

    // Q164
    magnifyingGlassFocalLength: function () {
        const n = randomFromList([2, 4, 5, 10, 20]);
        const correct = 25 / n;
        const text = `Kính lúp ghi G = ${n}x. Xác định loại thấu kính và tiêu cự.`;
        const options = [
            `Thấu kính hội tụ có $f = ${formatNumber(correct)}$ cm`,
            `Thấu kính phân kì có $f = ${formatNumber(correct)}$ cm`,
            `Thấu kính hội tụ có $f = ${formatNumber(correct * 2)}$ cm`,
            `Thấu kính phân kì có $f = ${formatNumber(correct * 2)}$ cm`
        ];
        return { text, options, correct: 0, rationale: `$f = \\dfrac{25}{${n}} = ${formatNumber(correct)}\\ \\text{cm}$` };
    },

    // Q165
    magnifyingGlassImageDistance: function () {
        const f = randomFromList([1, 2, 3, 4, 5]) * 5;
        const d = f * 4 / 5;
        const d_prime_abs = (f * d) / (f - d);
        const h_prime_ratio = d_prime_abs / d;
        const text = `Kính lúp f = ${f}cm, vật cách kính d = ${d}cm. Tính độ phóng đại và khoảng cách ảnh.`;
        const options = [
            `$d + |d'| = ${formatNumber(d + d_prime_abs)}$ cm, ảnh cao gấp ${formatNumber(h_prime_ratio)} lần vật`,
            `$d + |d'| = ${formatNumber(d + d_prime_abs * 2)}$ cm, ảnh cao gấp ${formatNumber(h_prime_ratio * 2)}$ lần vật`,
            `$d + |d'| = ${formatNumber(d + d_prime_abs / 2)}$ cm, ảnh cao gấp ${formatNumber(h_prime_ratio / 2)}$ lần vật`,
            `$d + |d'| = ${formatNumber(d + d_prime_abs + 1)}$ cm, ảnh cao gấp ${formatNumber(h_prime_ratio + 1)}$ lần vật`
        ];
        return { text, options, correct: 0, rationale: `$|d'| = ${formatNumber(d_prime_abs)}\\ \\text{cm}$; tỉ lệ = ${formatNumber(h_prime_ratio)}$` };
    },

    // Q166
    magnifyingGlassObjectDistance: function () {
        const f = randomFromList([1, 2, 3, 4, 5]) * 3;
        const h = randomFromList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const correct_d = 9 * f / 10;
        const correct_d_abs = 9 * f;
        const text = `Kính lúp f = ${f}cm, vật cao ${h}mm, muốn ảnh cao ${10 * h}mm. Tính d và |d'|.`;
        const options = [
            `$d = ${formatNumber(correct_d)}$ cm, $|d'| = ${formatNumber(correct_d_abs)}$ cm`,
            `$d = ${formatNumber(correct_d * 2)}$ cm, $|d'| = ${formatNumber(correct_d_abs * 2)}$ cm`,
            `$d = ${formatNumber(correct_d / 2)}$ cm, $|d'| = ${formatNumber(correct_d_abs / 2)}$ cm`,
            `$d = ${formatNumber(correct_d + 1)}$ cm, $|d'| = ${formatNumber(correct_d_abs + 1)}$ cm`
        ];
        return { text, options, correct: 0, rationale: `$d = \\dfrac{9f}{10} = ${formatNumber(correct_d)}\\ \\text{cm}$; $|d'| = 9f = ${formatNumber(correct_d_abs)}\\ \\text{cm}$` };
    },

    // Q167
    magnifyingGlassTotalDistance: function () {
        const G = randomFromList([2, 5, 10, 20]);
        const d = 15 / G;
        const f = 25 / G;
        const d_prime_abs = (d * f) / (f - d);
        const total = d + d_prime_abs;
        const text = `Kính lúp G = ${G}x, d = ${d}cm. Tính khoảng cách từ vật đến ảnh.`;
        const options = generateDistractors(total, 'cm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(total) + ' cm');
        return { text, options, correct: options.indexOf(formatNumber(total) + ' cm'), rationale: `$|d'| = ${formatNumber(d_prime_abs)}\\ \\text{cm}$; tổng = ${formatNumber(total)}\\ \\text{cm}$` };
    }
};

// ---------------- Hàm sinh câu hỏi ----------------

function generateQuestionFromTemplate(q) {
    if (q.type === 'static') {
        return { ...q };
    }
    const handler = templateHandlers[q.templateId];
    if (handler) {
        return handler();
    } else {
        console.warn('Template not found:', q.templateId);
        return { text: 'Câu hỏi chưa được hỗ trợ', options: ['A', 'B', 'C', 'D'], correct: 0, rationale: 'Vui lòng kiểm tra lại dữ liệu.' };
    }
}

// ---------------- Load data và UI ----------------

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            appData = data;
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('setup-screen').classList.remove('hidden');
            populateLessonSelect();
        })
        .catch(error => {
            console.error("Lỗi tải dữ liệu:", error);
            document.getElementById('loading').innerText = "Lỗi tải dữ liệu. Hãy chạy trên local server.";
        });
});

function populateLessonSelect() {
    const select = document.getElementById('lesson-select');
    select.innerHTML = '<option value="all">Tất cả các bài</option>';
    appData.lessons.forEach(lesson => {
        const option = document.createElement('option');
        option.value = lesson.id;
        option.textContent = lesson.name;
        select.appendChild(option);
    });
}

function startQuiz(difficulty) {
    const lessonId = document.getElementById('lesson-select').value;
    let pool = [];

    if (lessonId === 'all') {
        appData.lessons.forEach(l => pool.push(...l.questions));
    } else {
        const lesson = appData.lessons.find(l => l.id === lessonId);
        if (lesson) pool = [...lesson.questions];
    }

    let levelMap = { easy: ['NB', 'TH'], medium: ['NB', 'TH', 'VD'], hard: ['TH', 'VD', 'VDC'] };
    let levels = levelMap[difficulty] || ['NB', 'TH', 'VD', 'VDC'];
    pool = pool.filter(q => levels.includes(q.level));

    pool = pool.sort(() => Math.random() - 0.5);
    const numQuestions = Math.min(pool.length, 20);
    currentQuiz = pool.slice(0, numQuestions).map(q => generateQuestionFromTemplate(q));

    currentIndex = 0;
    score = 0;
    showScreen('quiz-screen');
    updateQuizTitle(difficulty, lessonId);
    showQuestion();
}

function showQuestion() {
    const q = currentQuiz[currentIndex];
    document.getElementById('progress').innerText = `Câu ${currentIndex + 1}/${currentQuiz.length}`;

    let contentHTML = `<span>${q.text}</span>`;
    if (q.image) {
        contentHTML += `<img src="${q.image}" alt="Minh họa" class="question-image">`;
    }
    document.getElementById('question-content').innerHTML = contentHTML;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "text-left p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-900 hover:border-blue-200 transition flex items-center";
        btn.innerHTML = `<span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-sm font-bold text-gray-500">${String.fromCharCode(65 + i)}</span> <span>${opt}</span>`;
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');

    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(selectedIdx) {
    const q = currentQuiz[currentIndex];
    const feedback = document.getElementById('feedback');
    const options = document.getElementById('options').children;

    for (let btn of options) btn.onclick = null;

    if (selectedIdx === q.correct) {
        score++;
        options[selectedIdx].classList.add('bg-green-900', 'border-green-500');
        feedback.innerHTML = `<p class="text-green-50 font-bold">Chính xác!</p><p class="text-sm mt-1">${q.rationale || ''}</p>`;
        feedback.className = "block p-4 bg-green-950 border border-green-200 rounded-lg mb-6";
    } else {
        options[selectedIdx].classList.add('bg-red-900', 'border-red-500');
        options[q.correct].classList.add('bg-green-900', 'border-green-500');
        feedback.innerHTML = `<p class="text-red-50 font-bold">Sai rồi!</p><p class="text-sm mt-1">${q.rationale || ''}</p>`;
        feedback.className = "block p-4 bg-red-950 border border-red-200 rounded-lg mb-6";
    }

    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.remove('hidden');
    nextBtn.innerText = (currentIndex === currentQuiz.length - 1) ? "Xem kết quả" : "Câu tiếp theo";

    if (window.MathJax) MathJax.typesetPromise();
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < currentQuiz.length) showQuestion();
    else showResults();
};

function showResults() {
    showScreen('result-screen');
    document.getElementById('score-text').innerText = `${score}/${currentQuiz.length}`;
    const percent = (score / currentQuiz.length) * 100;
    let comment = percent >= 90 ? "Xuất sắc! Bạn đã nắm vững kiến thức." :
        percent >= 70 ? "Khá tốt! Hãy cố gắng thêm chút nữa nhé." :
            percent >= 50 ? "Đạt yêu cầu. Bạn nên ôn lại các công thức quan trọng." :
                "Bạn cần cố gắng nhiều hơn. Hãy đọc kỹ lại sách giáo khoa.";
    document.getElementById('performance-comment').innerText = comment;
}

function showSetup() {
    showScreen('setup-screen');
}

function showScreen(screenId) {
    ['setup-screen', 'quiz-screen', 'result-screen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function updateQuizTitle(difficulty, lessonId) {
    let diffName = difficulty === 'easy' ? 'Dễ' : (difficulty === 'medium' ? 'Trung bình' : 'Khó');
    let lessonName = lessonId === 'all' ? 'Tổng hợp' : appData.lessons.find(l => l.id === lessonId).name;
    document.getElementById('quiz-title').innerText = `${lessonName} - Mức ${diffName}`;
}