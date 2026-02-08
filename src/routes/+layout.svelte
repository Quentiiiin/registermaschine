<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>registermaschine</title>
</svelte:head>
<div class="w-full h-dvh bg-fuchsia-200 p-4 box-border overflow-hidden">
  {@render children()}
</div>
