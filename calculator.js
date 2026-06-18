class Calculator {
    constructor() {
        this.input = "";
        this.result = "";
        this.displayInput = document.getElementById("calc-input");
        this.displayResult = document.querySelector(".calculator .result");
        this.init();
    }

    init() {
        const keyPad = document.querySelector(".calc-input");
        keyPad.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") return;
            const value = e.target.innerText;
            const classList = e.target.classList;

            if (e.target.id === "ac") this.clearAll();
            else if (e.target.id === "del") this.deleteLast();
            else if (classList.contains("equals")) this.calculate();
            else if (classList.contains("num")) this.appendNumber(value);
            else if (classList.contains("op")) this.appendOperator(value);
        });
    }

    appendNumber(num) {
        if (this.result !== "") this.clearAll();
        this.input += num;
        this.updateDisplay();
    }

    appendOperator(op) {
        if (this.result !== "") {
            this.input = this.result;
            this.result = "";
            this.displayResult.innerHTML = "<br>";
        }
        if (this.input === "") return;
        this.input += op;
        this.updateDisplay();
    }

    calculate() {
        if (this.input === "") {
            this.displayResult.innerHTML = "<br>";
            return;
        }
        try {
            this.result = new Function("return " + this.input)();
            if (this.result.toString().length > 12) {
                this.result = Number(this.result).toExponential(4);
            }
            this.displayResult.innerText = this.result;
        } catch (e) {
            this.clearAll();
            this.displayResult.innerText = "Error!";
        }
    }

    deleteLast() {
        if (this.result !== "") return this.clearAll();
        if (this.input.length <= 1) return this.clearAll();
        this.input = this.input.slice(0, -1);
        this.updateDisplay();
    }

    clearAll() {
        this.input = "";
        this.result = "";
        this.displayInput.value = "";
        this.displayResult.innerHTML = "<br>";
    }

    updateDisplay() {
        this.displayInput.value = this.input;
        this.displayInput.scrollLeft = this.displayInput.scrollWidth;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const myCalculator = new Calculator();

    $("#calc .window-content").height("auto");

    $("#calc .window").click(() => {
        return false;
    });

    $(".open-calculator").click(() => {
        var calcZ = $("#calc .window").css("z-index");
        if (calcZ == String(openedwindows.length) && calcZ != "0") {
            $(".close-calculator").click();
        } else {
            windowOnTop($("#calc .window")[0]);
        }
    });

    $(".close-calculator").click(() => {
        closeWindow($("#calc .window")[0]);

        myCalculator.clearAll();
    });
});
