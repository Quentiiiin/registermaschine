<script lang="ts">
  import { instructionMap, parseInstructions } from "$lib/instructions";
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

<div
  class="h-full w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4"
>
  <div class="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-fuchsia-100 flex-1 flex flex-col min-h-0 overflow-hidden"
    >
      <div
        class="px-4 py-2 border-b border-fuchsia-100 bg-white/50 flex justify-between items-center"
      >
        <h2 class="font-bold text-fuchsia-900">Editor</h2>
        {#if parsingError || errorMessage}
          <span
            class="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded"
          >
            {parsingError || errorMessage}
          </span>
        {/if}
      </div>

      <div class="flex-1 overflow-y-auto p-4 flex font-mono text-sm relative">
        <div
          class="pr-3 border-r border-fuchsia-100 text-fuchsia-300 text-right select-none min-h-full"
        >
          {#each lines as line}
            <div class="leading-6 h-6 w-8">
              {#if machine.currentInstructionIndex === line}
                <span class="font-black text-fuchsia-600 relative">
                  {line}
                  <div
                    class="absolute -left-2 top-1.5 w-1.5 h-1.5 bg-fuchsia-500 rounded-full"
                  ></div>
                </span>
              {:else}
                {line}
              {/if}
            </div>
          {/each}
        </div>

        <textarea
          bind:value={content}
          oninput={handleInput}
          bind:this={textarea}
          class="flex-1 pl-3 bg-transparent resize-none focus:outline-none leading-6 text-zinc-800 min-h-full overflow-hidden"
          spellcheck="false"
          rows="1"
          placeholder="Enter instructions here..."
        ></textarea>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-4 h-full min-h-0">
    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-fuchsia-100 p-4"
    >
      <h2
        class="font-bold text-fuchsia-900 mb-3 text-sm uppercase tracking-wide"
      >
        Control Panel
      </h2>

      <div class="grid grid-cols-2 gap-2 mb-4">
        <button
          class="col-span-1 px-4 py-2 rounded-lg font-bold transition-all active:scale-95 shadow-sm
            {machine.isRunning
            ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'
            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border border-emerald-200'}"
          onclick={() => (machine.isRunning ? machine.stop() : machine.start())}
        >
          {machine.isRunning ? "Stop" : "Start"}
        </button>

        <button
          class="col-span-1 px-4 py-2 bg-white border border-fuchsia-200 text-fuchsia-700 rounded-lg font-bold hover:bg-fuchsia-50 transition-all active:scale-95 shadow-sm"
          onclick={() => machine.step()}
        >
          Step
        </button>

        <button
          class="col-span-2 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg font-medium hover:bg-zinc-200 transition-all active:scale-95 text-sm"
          onclick={() => machine.reset()}
        >
          Reset Machine
        </button>
      </div>

      <div
        class="flex items-center gap-3 bg-fuchsia-50 p-2 rounded-lg border border-fuchsia-100"
      >
        <span
          class="text-xs font-bold text-fuchsia-700 uppercase tracking-wider"
          >Delay</span
        >
        <input
          class="flex-1 bg-white border border-fuchsia-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-fuchsia-400"
          type="number"
          min="0"
          step="10"
          bind:value={machine.delay}
        />
        <span class="text-xs text-fuchsia-500">ms</span>
      </div>
    </div>

    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-fuchsia-100 flex-1 flex flex-col min-h-0 overflow-hidden"
    >
      <div class="px-4 py-2 border-b border-fuchsia-100 bg-white/50">
        <h2 class="font-bold text-fuchsia-900 text-sm uppercase tracking-wide">
          Registers
        </h2>
      </div>
      <div class="flex-1 overflow-hidden relative">
        <div class="absolute inset-0">
          <Register registers={machine.registers} />
        </div>
      </div>
    </div>

    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-fuchsia-100 flex-none max-h-60 flex flex-col overflow-hidden"
    >
      <div class="px-4 py-2 border-b border-fuchsia-100 bg-white/50">
        <h2 class="font-bold text-fuchsia-900 text-sm uppercase tracking-wide">
          Reference
        </h2>
      </div>
      <div class="overflow-y-auto p-2 text-xs">
        <table class="w-full text-left border-collapse">
          <tbody class="divide-y divide-fuchsia-50">
            {#each Object.entries(instructionMap) as instr}
              <tr
                ><td class="py-1 px-2 font-mono text-fuchsia-700 font-bold"
                  >{instr[0]}</td
                ><td class="py-1 px-2 text-zinc-600">{instr[1]}</td></tr
              >
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
