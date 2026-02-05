<script lang="ts">
  import { parseInstructions } from "$lib/instructions";
  import { Machine } from "$lib/machine.svelte";
  import Register from "$lib/Register.svelte";

  let textarea: HTMLTextAreaElement | undefined = $state();

  let machine: Machine = $state(new Machine());

  let errorMessage: string = $derived.by(() => {
    switch (machine.status) {
      case -1:
        return "Error: Missing halt statement";
      case -2:
        return "Error: Invalid parameter";
    }
    return "";
  });

  let parsingError: string = $state("");

  let content = $state("");
  let lines = $derived.by(() => {
    const l = [];
    const r = content.split("\n").length;
    for (let i = 0; i < r; i++) {
      l.push(i);
    }
    return l;
  });

  function handleInput() {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      const parsed = parseInstructions(content);
      if (parsed.inst) {
        machine.instructions = parsed.inst;
        parsingError = "";
      } else if (parsed.line !== undefined) {
        parsingError = `Error parsing line ${parsed.line}`;
      }
    }
  }
</script>

<div class="  flex">
  <div class=" pr-2 w-8 text-zinc-800">
    {#each lines as line}
      {#if machine.currentInstructionIndex === line}
        <span class=" font-black underline">{line}</span>
      {:else}
        {line}
      {/if}
      <br />
    {/each}
  </div>
  <div>
    <textarea
      rows="1"
      bind:value={content}
      oninput={handleInput}
      bind:this={textarea}
      class=" resize-none bg-fuchsia-100 textinput overflow-y-hidden"
      spellcheck="false"
    ></textarea>
    <div class=" text-red-400 font-bold">{errorMessage}</div>
    <div class=" text-orange-400 font-bold">{parsingError}</div>
  </div>
</div>

<div class=" bg-fuchsia-100 flex h-min flex-col mx-2">
  <button
    onclick={() => (machine.isRunning ? machine.stop() : machine.start())}
  >
    {#if machine.isRunning}
      stop
    {:else}
      start
    {/if}
  </button>
  <div>
    delay:
    <input
      class=" focus:outline-0 w-12 p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      type="number"
      bind:value={machine.delay}
    />ms
  </div>
  <button class=" bg-pink-300 px-1" onclick={() => machine.step()}>
    step
  </button>
  <button onclick={() => machine.reset()}> reset </button>
</div>

<Register registers={machine.registers} />

<p class=" pl-1">
  load x: Load value from x to accumulator
  <br />
  loadi n: Load n to accumulator
  <br />
  store x: Store accumulator value to x
  <br />
  jmp n: jump to n
  <br />
  jeq n: Jump if equal to zero
  <br />
  jge n: Jump if greater or equal to zero
  <br />
  jle n: Jump if less or equal to zero
  <br />
  jgt n: Jump if greater than zero
  <br />
  jlt n: Jump if less than zero
  <br />
  hold: Stop program execution
  <br />
  add x: Add memory value to accumulator
  <br />
  sub x: Subtract memory value from accumulator
  <br />
  mul x: Multiply accumulator by memory value
  <br />
  div x: Divide accumulator by memory value
  <br />
  loadind x: Load from address pointed to by memory
  <br />
  storeind x: Store to address pointed to by memory
</p>

<style>
  .textinput {
    width: calc(50vw - 4rem);
    -webkit-spell-check: false;
    -moz-spell-check: false;
  }
  .textinput:focus {
    border-radius: 0px;
    outline: none;
  }
</style>
