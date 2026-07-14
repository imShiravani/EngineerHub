let lastGlobalResult = null;

function evaluateExpression(expr) {
    let processed = expr.replace(/\^/g, '**').replace(/x²/g, '**2');
    processed = processed.replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(');
    processed = processed.replace(/asin\(/g, 'Math.asin(').replace(/acos\(/g, 'Math.acos(').replace(/atan\(/g, 'Math.atan(');
    processed = processed.replace(/sqrt\(/g, 'Math.sqrt(').replace(/ln\(/g, 'Math.log(').replace(/log\(/g, 'Math.log10(');
    processed = processed.replace(/pi/g, 'Math.PI').replace(/e/g, 'Math.E');
    processed = processed.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    try {
        const result = new Function('return (' + processed + ')')();
        if (isNaN(result) || !isFinite(result)) throw new Error();
        return parseFloat(result.toFixed(10));
    } catch (e) {
        return currentLang === 'fa' ? "خطا" : "Error";
    }
}

function buildCalculator() {
    const container = document.getElementById('widgetContainer');
    container.innerHTML = `<div class="calculator"><div class="calc-screen"><div class="calc-expression" id="calcExpression">0</div><div class="calc-result" id="calcResult"></div></div><div class="calc-buttons" id="calcButtons"></div></div>`;

    const expressionDiv = document.getElementById('calcExpression');
    const resultDiv = document.getElementById('calcResult');
    let localExpression = "0",
        localLastResult = null;
    const updateDisplay = () => {
        expressionDiv.innerText = localExpression || "0";
        resultDiv.innerText = (localLastResult !== null && localLastResult !== "") ? localLastResult : "";
    };
    const setExpression = (newExpr, computeNow) => {
        localExpression = newExpr;
        if (computeNow && localExpression.trim()) {
            const lastChar = localExpression.trim().slice(-1);
            const operators = ['+', '-', '*', '/', '^', '%'];
            if (!operators.includes(lastChar) && lastChar !== '(') {
                const res = evaluateExpression(localExpression);
                if (typeof res === 'number' && !isNaN(res)) {
                    localLastResult = res;
                    lastGlobalResult = localLastResult;
                } else {
                    localLastResult = null;
                }
            } else {
                localLastResult = null;
            }
        } else {
            localLastResult = null;
        }
        updateDisplay();
    };
    const append = (val, autoCompute = true) => {
        let newExpr = (localExpression === "0" ? "" : localExpression) + val;
        const operators = ['+', '-', '*', '/', '^', '%'];
        if (operators.includes(val)) {
            autoCompute = false;
        }
        setExpression(newExpr, autoCompute);
    };
    const clearAll = () => setExpression("0", false);
    const back = () => {
        if (localExpression === "0" || localExpression.length === 0) return;
        let newExpr = localExpression.slice(0, -1);
        setExpression(newExpr || "0", true);
    };
    const applyFunc = (func) => {
        let newExpr = (localExpression === "0" ? "" : localExpression) + func + "(";
        setExpression(newExpr, false);
    };
    const compute = () => {
        if (!localExpression || localExpression === "0") return;
        const res = evaluateExpression(localExpression);
        if (typeof res === 'number' && !isNaN(res)) {
            setExpression(res.toString(), false);
            localLastResult = res;
            lastGlobalResult = res;
        } else {
            resultDiv.innerText = currentLang === 'fa' ? "خطا" : "Error";
            setTimeout(() => updateDisplay(), 1200);
        }
    };
    const ans = () => {
        if (lastGlobalResult && lastGlobalResult !== "Error") {
            let newExpr = (localExpression === "0" ? "" : localExpression) + lastGlobalResult;
            setExpression(newExpr, true);
        }
    };
    const getTooltip = (label) => {
        const map = {
            "sin": "tip_sin",
            "cos": "tip_cos",
            "tan": "tip_tan",
            "asin": "tip_asin",
            "acos": "tip_acos",
            "atan": "tip_atan",
            "ln": "tip_ln",
            "log": "tip_log",
            "√": "tip_sqrt",
            "^": "tip_pow",
            "π": "tip_pi",
            "e": "tip_e",
            "(": "tip_open",
            ")": "tip_close",
            "C": "tip_clear",
            "⌫": "tip_back",
            "%": "tip_percent",
            "x²": "tip_x2",
            "Ans": "tip_ans",
            "=": "tip_equal",
            "/": "tip_div",
            "*": "tip_mul",
            "-": "tip_sub",
            "+": "tip_add",
            "0": "tip_0",
            "1": "tip_1",
            "2": "tip_2",
            "3": "tip_3",
            "4": "tip_4",
            "5": "tip_5",
            "6": "tip_6",
            "7": "tip_7",
            "8": "tip_8",
            "9": "tip_9",
            ".": "tip_dot"
        };
        return translations[currentLang][map[label]] || label;
    };

    const buttons = [
        { label: "sin", class: "func", action: () => applyFunc("sin") },
        { label: "cos", class: "func", action: () => applyFunc("cos") },
        { label: "tan", class: "func", action: () => applyFunc("tan") },
        { label: "ln", class: "func", action: () => applyFunc("ln") },
        { label: "log", class: "func", action: () => applyFunc("log") },
        { label: "asin", class: "func", action: () => applyFunc("asin") },
        { label: "acos", class: "func", action: () => applyFunc("acos") },
        { label: "atan", class: "func", action: () => applyFunc("atan") },
        { label: "√", class: "func", action: () => applyFunc("sqrt") },
        { label: "^", class: "op", action: () => append("^") },
        { label: "(", class: "func", action: () => append("(") },
        { label: ")", class: "func", action: () => append(")") },
        { label: "x²", class: "func", action: () => append("x²") },
        { label: "e", class: "func", action: () => append("e") },
        { label: "C", class: "clear", action: clearAll },
        { label: "7", class: "", action: () => append("7") },
        { label: "8", class: "", action: () => append("8") },
        { label: "9", class: "", action: () => append("9") },
        { label: "*", class: "op", action: () => append("*") },
        { label: "⌫", class: "back", action: back },
        { label: "4", class: "", action: () => append("4") },
        { label: "5", class: "", action: () => append("5") },
        { label: "6", class: "", action: () => append("6") },
        { label: "-", class: "op", action: () => append("-") },
        { label: "%", class: "func", action: () => append("%") },
        { label: "1", class: "", action: () => append("1") },
        { label: "2", class: "", action: () => append("2") },
        { label: "3", class: "", action: () => append("3") },
        { label: "+", class: "op", action: () => append("+") },
        { label: "=", class: "equal", action: compute },
        { label: "0", class: "", action: () => append("0") },
        { label: ".", class: "", action: () => append(".") },
        { label: "π", class: "func", action: () => append("pi") },
        { label: "/", class: "op", action: () => append("/") },
        { label: "Ans", class: "func", action: ans }
    ];

    const grid = document.getElementById('calcButtons');
    grid.innerHTML = "";
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.innerText = btn.label;
        button.className = `calc-btn ${btn.class}`;
        button.title = getTooltip(btn.label);
        button.onclick = btn.action;
        grid.appendChild(button);
    });
    setExpression("0", false);
    addBackToHomeButton(container);
}