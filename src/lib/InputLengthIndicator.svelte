<script lang="ts">
	export let text: string;
	export let maxLength: number;
	export let minLength: number | undefined = undefined;

	$: invalid = text.length > maxLength || (minLength && text.length < minLength);
</script>

<div
	class="px-5 text-end opacity-50 text-sm transition-opacity"
	class:!opacity-100={text.length >= maxLength}
	class:!opacity-90={invalid}
	class:text-error-600={invalid}
>
	{text.length} / {maxLength} characters
</div>
