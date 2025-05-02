<template>
    <div>
        <AppHeader />
        <main class="container mx-auto p-4 min-h-screen">
            <slot />
        </main>
        <AppFooter />
        <ContactFloatingButton />
    </div>
</template>

<script setup>
</script>

<style>
body {
    font-family: sans-serif;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: linear-gradient(to right, #86efac, #d9f99d, #d9f99d);
    color: #333333;
}
</style>
