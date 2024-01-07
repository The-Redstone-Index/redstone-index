<script lang="ts">
	import { onMount } from 'svelte';

	let editorEl: HTMLElement;

	onMount(async () => {
		const BalloonEditor = (await import('@ckeditor/ckeditor5-build-balloon')).default;

		console.log();

		BalloonEditor.builtinPlugins.forEach((f) => {
			console.log(f.pluginName);
		});
		console.log(editorEl);

		BalloonEditor.create(editorEl, {
			placeholder: 'Welcome to CKEditor 5!',
			// toolbar: ['bold', 'italic'],
			link: {
				addTargetToExternalLinks: true,

				decorators: {
					// isExternal: {
					// 	mode: 'automatic',
					// 	callback: (url) => url?.startsWith('http://') || true,
					// 	attributes: {
					// 		target: '_blank',
					// 		rel: 'noopener noreferrer'
					// 	}
					// }
				}
			},
			// plugins: []
			// removePlugins: ['Heading', 'CKFinderUploadAdapter', 'CKBox', 'CKFinder', 'CloudServices', 'EasyImage', 'Image'],
			plugins: [
				'Essentials',
				'Autoformat',
				'Bold',
				'Italic',
				'BlockQuote',
				'Link',
				'List',
				'Paragraph'
			]
		}).catch((error: Error) => {
			console.error(error);
		});
	});
</script>

<!-- CAN'T GET LINK MENU TO APPEAR, POSITION IS STUCK AT -9999999px -9999999px -->
<div bind:this={editorEl} class="min-h-[20rem] !textarea px-3 py-2 rich-text-editor" />
