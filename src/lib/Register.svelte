<script lang="ts">
  interface Props {
    registers: number[];
  }
  const { registers }: Props = $props();
</script>

<div class="flex flex-col w-full h-full overflow-y-auto">
  {#each registers as value, index}
    <div
      class="border-b border-fuchsia-200 py-1 px-2 flex justify-between text-sm"
    >
      <span class="font-mono text-fuchsia-800 font-semibold">
        {#if index === 0}
          ACC
        {:else}
          R{index}
        {/if}
      </span>
      <span class="font-mono text-zinc-700">{value}</span>
    </div>
  {/each}
</div>
