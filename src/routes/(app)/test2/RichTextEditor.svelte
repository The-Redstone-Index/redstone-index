<script lang="ts">
	import type { Content, JSONContent } from '@tiptap/core';
	import Blockquote from '@tiptap/extension-blockquote';
	import Bold from '@tiptap/extension-bold';
	import BulletList from '@tiptap/extension-bullet-list';
	import CharacterCount from '@tiptap/extension-character-count';
	import Document from '@tiptap/extension-document';
	import History from '@tiptap/extension-history';
	import Italic from '@tiptap/extension-italic';
	import Link from '@tiptap/extension-link';
	import ListItem from '@tiptap/extension-list-item';
	import Mention from '@tiptap/extension-mention';
	import OrderedList from '@tiptap/extension-ordered-list';
	import Paragraph from '@tiptap/extension-paragraph';
	import Placeholder from '@tiptap/extension-placeholder';
	import Text from '@tiptap/extension-text';
	import Underline from '@tiptap/extension-underline';
	import { onMount } from 'svelte';
	import { BubbleMenu, Editor, EditorContent, createEditor } from 'svelte-tiptap';
	import type { Readable } from 'svelte/store';

	export let content: Content = null;
	export let placeholder: string | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let readonly: boolean | undefined = undefined;
	export let maxlength: number | undefined = undefined;

	let editor: Readable<Editor>;

	$: editable = !(readonly || disabled);
	$: $editor?.setEditable(editable);

	onMount(() => {
		editor = createEditor({
			onUpdate: () => {
				content = $editor.getJSON();
			},
			editable,
			extensions: [
				Document,
				Text,
				Placeholder.configure({ placeholder }),
				Italic,
				Bold,
				Paragraph.configure({ HTMLAttributes: { class: 'my-1' } }),
				Link.configure({
					HTMLAttributes: { class: 'anchor', target: '_blank' },
					openOnClick: editable,
					protocols: ['https', 'http']
				}),
				History,
				ListItem,
				OrderedList.configure({ HTMLAttributes: { class: 'list-decimal pl-6' } }),
				BulletList.configure({ HTMLAttributes: { class: 'list-disc pl-6' } }),
				Blockquote.configure({ HTMLAttributes: { class: 'blockquote' } }),
				Underline,
				Mention.configure({}),
				CharacterCount.configure({
					limit: maxlength
				})
			],
			content,
			editorProps: {
				attributes: {
					class: 'focus:outline-none textarea px-3 py-2 min-h-[6em]',
					...(readonly ? { readonly: '1' } : {}),
					...(disabled ? { disabled: '1' } : {})
				}
			}
		});
	});
</script>

{#if editor}
	{@const linksInSelectedArea = $editor.getAttributes('link').href}
	{@const singleLinkSelected = $editor.isActive('link')}

	<EditorContent editor={$editor} />
	<BubbleMenu
		editor={$editor}
		class="card !ring-primary-500/40 rounded-full p-2 flex gap-2 h-14 w-fit"
	>
		<button
			class="btn-icon variant-soft-surface"
			on:click={() => $editor.chain().focus().toggleBold().run()}
			class:!variant-soft-primary={$editor.isActive('bold')}
		>
			<i class="fas fa-bold" />
		</button>
		<button
			class="btn-icon variant-soft-surface"
			on:click={() => $editor.chain().focus().toggleItalic().run()}
			class:!variant-soft-primary={$editor.isActive('italic')}
		>
			<i class="fas fa-italic" />
		</button>
		<button
			class="btn-icon variant-soft-surface"
			on:click={() => $editor.chain().focus().toggleUnderline().run()}
			class:!variant-soft-primary={$editor.isActive('underline')}
		>
			<i class="fas fa-underline" />
		</button>
		<button
			class="btn-icon variant-soft-surface"
			on:click={() => $editor.chain().focus().toggleOrderedList().run()}
			class:!variant-soft-primary={$editor.isActive('orderedList')}
		>
			<i class="fas fa-list-ol" />
		</button>
		<button
			class="btn-icon variant-soft-surface"
			on:click={() => $editor.chain().focus().toggleBulletList().run()}
			class:!variant-soft-primary={$editor.isActive('bulletList')}
		>
			<i class="fas fa-list-ul" />
		</button>
		<div class="btn-group variant-soft-surface" class:!variant-soft-primary={linksInSelectedArea}>
			{#if linksInSelectedArea}
				<a
					href={singleLinkSelected ? $editor.getAttributes('link').href : undefined}
					target="_blank"
					class="gap-3"
				>
					<i class="fas fa-link" />
					{#if singleLinkSelected}
						{$editor.getAttributes('link').href ?? ''}
					{:else}
						At least one link selected
					{/if}
				</a>
				<button on:click={() => $editor.chain().focus().unsetLink().run()}>
					<i class="fas fa-trash" />
				</button>
			{:else}
				<button class="gap-3">Paste a URL to create a link</button>
			{/if}
		</div>
	</BubbleMenu>
{/if}
