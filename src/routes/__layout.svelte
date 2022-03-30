<script>
	import '../app.css';
</script>

<div class="layout-container max-w-7xl mx-auto sm:px-6 lg:px-8">
	<slot />
</div>

<style>
	.layout-container {
		font-family: Inter, Verdana, Geneva, Tahoma, sans-serif;
		width: 100%;
		min-height: 100vh;
	}
</style>
