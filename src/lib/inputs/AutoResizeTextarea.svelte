<script lang="ts">
	export let value: string = '';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let rows: number | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let required: boolean | undefined = undefined;
	export let readonly: boolean | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let unstyled = false;

	let textareaElement: HTMLTextAreaElement;

	$: value, setTimeout(adjustTextAreaHeight, 0);
	$: textareaElement && adjustTextAreaHeight();
	function adjustTextAreaHeight() {
		if (!textareaElement) return;
		textareaElement.style.height = '';
		textareaElement.style.height = textareaElement.scrollHeight + 2 + 'px';
	}

	const baseClasses = 'resize-none transition-height hide-scrollbar';
	const styledClasses = 'textarea';
	const unstyledClasses = 'w-full bg-transparent border-0 p-0 focus:ring-transparent';
</script>

<textarea
	{id}
	{name}
	{rows}
	{placeholder}
	{disabled}
	{required}
	{readonly}
	{maxlength}
	{minlength}
	class={`${baseClasses} ${unstyled ? unstyledClasses : styledClasses} ${$$props.class}`}
	bind:this={textareaElement}
	bind:value
	on:keydown
/>
