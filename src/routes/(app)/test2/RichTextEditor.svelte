<script lang="ts">
	import { getSearchedUsers } from '$lib/api/users';
	import { supabaseStore } from '$lib/stores';
	import { mergeAttributes, type Content } from '@tiptap/core';
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
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';
	import { BubbleMenu, Editor, EditorContent, SvelteRenderer, createEditor } from 'svelte-tiptap';
	import type { Readable } from 'svelte/store';

	export let content: Content = null;
	export let placeholder: string | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let readonly: boolean | undefined = undefined;
	export let maxlength: number | undefined = undefined;

	Mention.config.renderHTML = ({ node, HTMLAttributes }) => {
		return [
			'a',
			mergeAttributes(
				{ 'data-type': Mention.name },
				{
					href: `/users/${HTMLAttributes['data-id']}`,
					target: '_blank',
					rel: 'noopener noreferrer nofollow',
					class: 'anchor'
				},
				Mention.options.HTMLAttributes,
				HTMLAttributes
			),
			Mention.options.renderLabel({
				options: Mention.options,
				node
			})
		];
	};

	const supabase = $supabaseStore;

	let editor: Readable<Editor>;

	$: editable = !(readonly || disabled);
	$: $editor?.setEditable(editable);

	let hello: HTMLElement;
	let showMentionsList = false;
	let mentionList: Tables<'users'>[] | null = [];
	let mentionCommand: Function;

	const debouncedUpdateMentionList = debounce(async (query: string) => {
		const [data, error] = await getSearchedUsers(supabase, { search: query, limit: 3 });
		if (error) {
			console.error(error);
			return;
		}
		mentionList = data;
	}, 500);

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

				Mention.configure({
					HTMLAttributes: {
						class: 'anchor cursor-pointer'
					},
					// renderLabel({ options, node }) {
					// 	return `${options.suggestion.char}${node.attrs.label} (${node.attrs.id})`;
					// },
					suggestion: {
						items: async ({ query }) => {
							debouncedUpdateMentionList(query);
							return [];
						},
						render() {
							return {
								onStart({ command }) {
									showMentionsList = true;
									mentionCommand = command;
								},
								onExit() {
									showMentionsList = false;
								}
							};
						}
					}
				}),
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

<div bind:this={hello} class="bg-red-500" id="hello">Hello</div>

{#if editor}
	{@const linksInSelectedArea = $editor.getAttributes('link').href}
	{@const singleLinkSelected = $editor.isActive('link')}

	<!-- Editor -->
	<EditorContent editor={$editor} />

	<!-- Mention list -->
	<BubbleMenu
		shouldShow={() => showMentionsList}
		tippyOptions={{
			maxWidth: 'auto',
			placement: 'bottom'
			// ^^^ NOT WORKING?!
		}}
		editor={$editor}
		class="card !ring-primary-500/40 flex gap-2 max-w-[20rem]"
	>
		<ul class="list space-y-0">
			{#each mentionList ?? [] as mention, i}
				<li>
					<button
						on:click|capture={() =>
							mentionCommand({ label: mention.username, id: mention.numeric_id })}
						class="btn hover:variant-soft-primary truncate !justify-start overflow-hidden max-w-[20rem] w-full"
					>
						{mention.username}
					</button>
				</li>
			{:else}
				<li class="btn opacity-50 font-semibold">No Users</li>
			{/each}
		</ul>
	</BubbleMenu>

	<!-- Tool Menu -->
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
