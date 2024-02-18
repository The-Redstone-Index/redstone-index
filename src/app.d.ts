import type { SpecValues } from '$lib/types';
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
		notifications: Tables<'user_notifications'>[];
	};
	type BuildCardDetails = Tables<'builds'> & {
		author: Tables<'users'>;
		schematic: Tables<'schematics'>;
		specifications: SpecValues; // (change type from JSON to object with specified schema)
	};
	type BuildDetails = BuildCardDetails & {
		extraSchematics: Tables<'schematics'>[];
		buildTags: Tables<'tags'>[];
	};
	type SchematicDetails = Tables<'schematics'> & {
		references: Tables<'build_extra_schematics'>[];
	};
	type UserProfile = Tables<'users'> & {
		schematics: Array<
			Tables<'schematics'> & {
				build: Tables<'builds'>;
				references: Tables<'build_extra_schematics'>[];
			}
		>;
		builds: Array<BuildCardDetails>;
		likedBuilds: Array<BuildCardDetails>;
	};
	type TagDetails = Tables<'tags'> & {
		parent: Tables<'tags'> | null;
		author: Tables<'users'> | null;
	};
	type SpecificationDetails = Tables<'specifications'> & {
		author: Tables<'users'> | null;
	};
	type CommentDetails = Tables<'comments'> & {
		author: Tables<'users'>;
		parent:
			| null
			| (Tables<'comments'> & {
					author: Tables<'users'>;
			  });
	};
	type UserReportDetails = Tables<'user_reports'> & {
		reporter_user: Tables<'users'>;
		reported_user: Tables<'users'>;
	};
}
