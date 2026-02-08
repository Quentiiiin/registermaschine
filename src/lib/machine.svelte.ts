import type { Instruction } from "./instructions";

export class Machine {
  registers: number[] = $state([]);
  instructions: Instruction[] = $state([]);
  currentInstructionIndex: number = $state(0);
  delay: number = $state(100);
  interval: number = -1;
  isRunning: boolean = $state(false);
  status: number = $state(0);

  constructor() {
    for (let i = 0; i < 256; i++) {
      this.registers[i] = 0;
    }
  }

  start() {
    this.stop();
    this.isRunning = true;
    this.interval = setInterval(() => {
      const res = this.runTick();
      this.status = res;
      if (res !== 1) this.stop();
    }, this.delay);
  }
  stop() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  reset() {
    this.stop();
    this.status = 0;
    for (let i = 0; i < 100; i++) {
      this.registers[i] = 0;
    }
    this.currentInstructionIndex = 0;
  }

  step() {
    this.status = this.runTick();
  }

  runTick() {
    const inst = this.instructions[this.currentInstructionIndex];
    if (!inst) return -1;

    if (inst.opcode === "hold") return 0;

    const x = inst.operand;

    if (x === undefined || !Number.isInteger(x)) return -2;

    let nextInstructionIndex = this.currentInstructionIndex + 1;

    if (inst.opcode === "loadi") {
      this.registers[0] = x;
    }

    switch (inst.opcode) {
      case "load":
        if (x < 1) return -2;
        this.registers[0] = this.registers[x] ?? 0;
        break;
      case "store":
        if (x < 1) return -2;
        this.registers[x] = this.registers[0];
        break;
      case "loadind":
        if (x < 1) return -2;
        this.registers[0] = this.registers[this.registers[x]];
        break;
      case "storeind":
        if (x < 1) return -2;
        this.registers[this.registers[x]] = this.registers[0];
        break;
      case "add":
        if (x < 1) return -2;
        this.registers[0] = this.registers[0] + this.registers[x];
        break;
      case "sub":
        if (x < 1) return -2;
        this.registers[0] = this.registers[0] - this.registers[x];
        break;
      case "mul":
        if (x < 1) return -2;
        this.registers[0] = this.registers[0] * this.registers[x];
        break;
      case "div":
        if (x < 1) return -2;
        this.registers[0] = this.registers[0] / this.registers[x];
        break;
      case "jmp":
        if (x < 1) return -2;
        nextInstructionIndex = x;
        break;
      case "jeq":
        if (x < 1) return -2;
        if (this.registers[0] === 0) nextInstructionIndex = x;
        break;
      case "jge":
        if (x < 1) return -2;
        if (this.registers[0] >= 0) nextInstructionIndex = x;
        break;
      case "jle":
        if (x < 1) return -2;
        if (this.registers[0] <= 0) nextInstructionIndex = x;
        break;
      case "jgt":
        if (x < 1) return -2;
        if (this.registers[0] > 0) nextInstructionIndex = x;
        break;
      case "jlt":
        if (x < 1) return -2;
        if (this.registers[0] < 0) nextInstructionIndex = x;
        break;
    }
    this.currentInstructionIndex = nextInstructionIndex;
    return 1;
  }
}
