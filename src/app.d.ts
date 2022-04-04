/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		user?: {
			id: string;
			name: string;
		};
	}
	// interface Platform {}
	interface Session {
		user?: {
			id: string;
			name: string;
		};
	}
	// interface Stuff {}
}
