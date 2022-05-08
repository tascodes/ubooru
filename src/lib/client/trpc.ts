import { browser } from '$app/env';
import type { Router } from '$lib/server/trpc';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const PRODUCTION_BASE_URL = import.meta.env.VITE_PRODUCTION_BASE_URL;

const trpcBaseURL =
	NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCTION_BASE_URL || '';

/**
 * Client used by the tRPC server for routing and logic
 */
export default trpc.createTRPCClient<Router>({
	url: browser ? '/trpc' : `${trpcBaseURL}/trpc`
});

type Query = keyof Router['_def']['queries'];
type Mutation = keyof Router['_def']['mutations'];

/**
 * Needed for tRPC type inference
 */
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
	Router['_def']['queries'][RouteKey]
>;

/**
 * Needed for tRPC type inference
 */
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
	Router['_def']['queries'][RouteKey]
>;

/**
 * Needed for tRPC type inference
 */
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
	Router['_def']['mutations'][RouteKey]
>;

/**
 * Needed for tRPC type inference
 */
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
	Router['_def']['mutations'][RouteKey]
>;
