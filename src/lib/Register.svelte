<script lang="ts">
  interface Props {
    registers: number[];
  }
  const { registers }: Props = $props();
</script>

<div class=" flex flex-col bg-fuchsia-100 p-1 w-26 overflow-y-scroll h-96">
  {#each registers as value, index}
    <div class=" border-b flex justify-between">
      <span>
        {#if index === 0}
          ACC
        {:else}
          {index}
        {/if}
      </span>
      {value}
    </div>
  {/each}
</div>
