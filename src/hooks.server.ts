import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleSecurity: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	
	// Content Security Policy
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self'",
		"connect-src 'self'",
		"frame-src https://www.google.com",
		"object-src 'none'",
		"base-uri 'self'"
	].join('; ');
	
	response.headers.set('Content-Security-Policy', csp);

	return response;
};

// Compose the handles
export const handle: Handle = async ({ event, resolve }) => {
	// First apply paraglide middleware
	return handleParaglide({
		event,
		resolve: async (event) => {
			// Then apply security headers
			return handleSecurity({ event, resolve });
		}
	});
};
