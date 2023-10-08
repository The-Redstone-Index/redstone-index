import { Session, SupabaseClient as _SupabaseClient } from '@supabase/supabase-js';
import type { Database as _Database } from '../types.gen';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
	type SupabaseClient = _SupabaseClient<Database>;
	type Database = _Database;
	type Tables<T extends keyof Database['public']['Tables']> =
		Database['public']['Tables'][T]['Row'];
	type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
	type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

	// Models
	type SelfUser = Tables<'users'> & {
		private: Tables<'users_private'>;
	};
	type BuildDetails = Tables<'builds'> & {
		author: Tables<'users'>;
		schematic: Tables<'schematics'>;
	};
	type UserProfile = Tables<'users'> & {
		schematics: Array<Tables<'schematics'> & { build: Tables<'builds'> }>;
		builds: Array<Tables<'builds'> & { schematic: Tables<'schematics'>; author: Tables<'users'> }>;
	};
}
