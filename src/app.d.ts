import { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types.gen';

declare global {
	namespace App {
		interface Locals {
			supabase: TypedSupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
	type TypedSupabaseClient = SupabaseClient<Database>;
}
