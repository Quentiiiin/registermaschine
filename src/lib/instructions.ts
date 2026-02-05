const instructionList = [
  "load",
  "loadi",
  "store",
  "jmp",
  "jeq",
  "jge",
  "jle",
  "jgt",
  "jlt",
  "hold",
  "add",
  "sub",
  "mul",
  "div",
  "loadind",
  "storeind",
] as const;

type opcode = (typeof instructionList)[number];

export type Instruction = {
  opcode: opcode;
  operand: number;
};

export function parseInstructions(code: string): {
  inst?: Instruction[];
  line?: number;
} {
  const lines = code.split("\n");
  const inst: Instruction[] = [];
  for (const [index, line] of lines.entries()) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const parts = trimmedLine.split(/\s+/);
    const code = parts[0] as opcode;
    const x = Number(parts[1]);

    if (!instructionList.includes(code)) return { line: index };
    if (code !== "hold" && Number.isNaN(x)) return { line: index };
    inst.push({ opcode: code, operand: x });
  }
  return { inst: inst };
}
