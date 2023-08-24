<script lang="ts">
	export let value: string = '';

	export let id: string = undefined;
	export let name: string = undefined;
	export let rows: string = undefined;
	export let placeholder: string = undefined;
	export let disabled: boolean = undefined;
	export let required: boolean = undefined;
	export let readonly: boolean = undefined;

	let textareaElement: HTMLTextAreaElement;

	$: value, setTimeout(adjustTextAreaHeight, 0);
	$: textareaElement && adjustTextAreaHeight();
	function adjustTextAreaHeight() {
		if (!textareaElement) return;
		textareaElement.style.height = '';
		textareaElement.style.height = textareaElement.scrollHeight + 2 + 'px';
	}
</script>

<textarea
	{id}
	{name}
	{rows}
	{placeholder}
	{disabled}
	{required}
	{readonly}
	class={'textarea resize-none transition-height hide-scrollbar ' + $$props.class}
	bind:this={textareaElement}
	bind:value
/>
