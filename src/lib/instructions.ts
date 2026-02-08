export const instructionMap = {
  load: "Load value from x to ACC",
  loadi: "Load immediate n to ACC",
  store: "Store ACC to x",
  jmp: "Jump to line n",
  jeq: "Jump if ACC == 0",
  jge: "Jump if ACC >= 0",
  jle: "Jump if ACC <= 0",
  jgt: "Jump if ACC > 0",
  jlt: "Jump if ACC < 0",
  hold: "Halt execution",
  add: "Add x to ACC",
  sub: "Sub x from ACC",
  mul: "Multiply ACC by x",
  div: "Divide ACC by x",
  loadind: "Load value from address in x to ACC",
  storeind: "Store ACC to address in x",
} as const;

type opcode = keyof typeof instructionMap;

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

    if (!Object.keys(instructionMap).includes(code)) return { line: index };
    if (code !== "hold" && Number.isNaN(x)) return { line: index };
    inst.push({ opcode: code, operand: x });
  }
  return { inst: inst };
}
