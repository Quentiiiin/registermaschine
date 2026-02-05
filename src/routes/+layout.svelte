<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>registermaschine</title>
</svelte:head>
<div class=" flex w-screen h-screen bg-fuchsia-200 p-2">
  {@render children()}
</div>
