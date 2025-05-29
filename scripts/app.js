// ---------- Strategy Pattern ----------
class OperationStrategy {
  execute(a, b) {
    throw new Error('Not implemented');
  }
}

class Add extends OperationStrategy {
  execute(a, b) { return a + b; }
}

class Subtract extends OperationStrategy {
  execute(a, b) { return a - b; }
}

class Multiply extends OperationStrategy {
  execute(a, b) { return a * b; }
}

class Divide extends OperationStrategy {
  execute(a, b) { return b === 0 ? 'Invalid input' : a / b; }
}

// ---------- Template Method Pattern ----------
class CalculatorTemplate {
  constructor() {
    this.result = 0;
  }

  calculate(a, b, strategy) {
    if (typeof a !== 'number' || typeof b !== 'number') return 'Invalid input';
    return this.executeOperation(a, b, strategy);
  }

  executeOperation(a, b, strategy) {
    return strategy.execute(a, b); // Método gancho
  }
}

// ---------- State Pattern ----------
class CalculatorState {
  constructor(calculator) {
    this.calculator = calculator;
  }

  input(char) {}
  setOperation(op) {}
  calculateResult() {}
  clear() {}
}

class StartState extends CalculatorState {
  input(char) {
    this.calculator.currentInput = char;
    this.calculator.setState(this.calculator.inputState);
    this.calculator.updateDisplay();
  }
}

class InputState extends CalculatorState {
  input(char) {
    this.calculator.currentInput += char;
    this.calculator.updateDisplay();
  }

  setOperation(op) {
    this.calculator.firstNumber = parseFloat(this.calculator.currentInput);
    this.calculator.currentInput = '';
    this.calculator.strategy = this.calculator.getStrategy(op);
    this.calculator.setState(this.calculator.operationState);
  }

  clear() {
    this.calculator.reset();
  }
}

class OperationState extends CalculatorState {
  input(char) {
    this.calculator.currentInput += char;
    this.calculator.updateDisplay();
  }

  calculateResult() {
    const secondNumber = parseFloat(this.calculator.currentInput);
    const result = this.calculator.template.calculate(
      this.calculator.firstNumber,
      secondNumber,
      this.calculator.strategy
    );
    this.calculator.currentInput = result.toString();
    this.calculator.setState(this.calculator.inputState);
    this.calculator.updateDisplay();
  }

  clear() {
    this.calculator.reset();
  }
}

// ---------- Calculator Context ----------
class Calculator {
  constructor() {
    this.display = document.getElementById('display');
    this.template = new CalculatorTemplate();

    this.startState = new StartState(this);
    this.inputState = new InputState(this);
    this.operationState = new OperationState(this);

    this.currentState = this.startState;

    this.firstNumber = 0;
    this.currentInput = '';
    this.strategy = null;
  }

  setState(state) {
    this.currentState = state;
  }

  updateDisplay() {
    this.display.textContent = this.currentInput || '0';
  }

  reset() {
    this.firstNumber = 0;
    this.currentInput = '';
    this.strategy = null;
    this.setState(this.startState);
    this.updateDisplay();
  }

  input(char) {
    this.currentState.input(char);
  }

  setOperation(op) {
    this.currentState.setOperation(op);
  }

  calculateResult() {
    this.currentState.calculateResult();
  }

  getStrategy(op) {
    switch(op) {
      case 'add': return new Add();
      case 'subtract': return new Subtract();
      case 'multiply': return new Multiply();
      case 'divide': return new Divide();
      default: return null;
    }
  }
}

// ---------- App Initialization ----------
const calc = new Calculator();

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.textContent;
    if (!btn.classList.contains('op')) {
      if (value === 'C') calc.reset();
      else calc.input(value);
    }
  });
});

document.querySelectorAll('.op').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    calc.setOperation(op);
  });
});

document.getElementById('equals').addEventListener('click', () => {
  calc.calculateResult();
});
