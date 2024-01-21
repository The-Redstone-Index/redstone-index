<script lang="ts">
	import { getRoleShortName } from '$lib/utils';

	export let user: Tables<'users'>;
	export let compact: boolean = false;
</script>

<div class="variant-outline-primary btn btn-sm text-xs" class:py-1={compact} class:px-2={compact}>
	{getRoleShortName(user.role)}
</div>
