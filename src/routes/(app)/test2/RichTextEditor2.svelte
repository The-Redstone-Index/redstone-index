<script lang="ts">
	import { Editor } from '@tiptap/core';
	import Blockquote from '@tiptap/extension-blockquote';
	import Bold from '@tiptap/extension-bold';
	import BulletList from '@tiptap/extension-bullet-list';
	import Document from '@tiptap/extension-document';
	import History from '@tiptap/extension-history';
	import Italic from '@tiptap/extension-italic';
	import Link from '@tiptap/extension-link';
	import ListItem from '@tiptap/extension-list-item';
	import OrderedList from '@tiptap/extension-ordered-list';
	import Paragraph from '@tiptap/extension-paragraph';
	import Placeholder from '@tiptap/extension-placeholder';
	import Text from '@tiptap/extension-text';
	import Underline from '@tiptap/extension-underline';
	import { onDestroy, onMount } from 'svelte';

	let element: HTMLDivElement;
	let editor: Editor;

	let editing = true;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Document,
				Text,
				Placeholder.configure({
					placeholder: 'Write something about yourself...'
				}),
				Italic,
				Bold,
				Paragraph.configure({ HTMLAttributes: { class: 'my-1' } }),
				Link.configure({
					HTMLAttributes: { class: 'anchor', target: '_blank' },
					openOnClick: !editing,
					protocols: ['https', 'http']
				}),
				History,
				OrderedList,
				ListItem,
				BulletList.configure({ HTMLAttributes: { class: 'ul' } }),
				Blockquote.configure({ HTMLAttributes: { class: 'blockquote' } }),
				Underline
			],
			editable: editing,
			editorProps: {
				attributes: {
					class: 'focus:outline-none textarea px-3 py-2 min-h-[6em]'
					// readonly: '1',
					// disabled: '1'
				}
			},
			content: '',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="relative">
	{#if editor}
		<button
			class="btn variant-soft-surface"
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:!variant-soft-primary={editor.isActive('bold')}
		>
			Bold
		</button>
		<button
			class="btn variant-soft-surface"
			on:click={() => editor.chain().focus().toggleLink({ href: '/' }).run()}
			class:!variant-soft-primary={editor.isActive('link', {})}
		>
			Link
		</button>
		<button
			class="btn variant-soft-surface"
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:!variant-soft-primary={editor.isActive('italic')}
		>
			Italic
		</button>
		<button
			class="btn variant-soft-surface"
			on:click={() => editor.chain().focus().toggleUnderline().run()}
			class:!variant-soft-primary={editor.isActive('underline')}
		>
			Underline
		</button>
	{/if}

	<div bind:this={element} class="" />
</div>

<style>
</style>
