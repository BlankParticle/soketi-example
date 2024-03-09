<script lang="ts">
  import PusherJS from "pusher-js";
  import { onMount } from "svelte";
  const client = new PusherJS("app-key", {
    wsHost: "127.0.0.1",
    cluster: "",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  let emails: { subject: string; sender: string }[] = [];
  const updateEmails = async () => {
    const res = await (await fetch("http://localhost:3000/emails")).json();
    emails = res;
  };
  client.subscribe("emails").bind("received", () => updateEmails());
  onMount(() => {
    updateEmails();
  });
</script>

<main>
  <h1>Emails Received</h1>
  <button on:click={() => updateEmails()}>Refresh</button>
  {#each emails as email}
    <div>
      <h2>{email.subject}</h2>
      <p>{email.sender}</p>
    </div>
  {/each}
</main>

<style>
</style>
