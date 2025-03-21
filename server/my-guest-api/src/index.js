/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
	  const url = new URL(request.url);
	  
	  if (request.method === "GET" && url.pathname === "/guests") {
		return getGuests(env);
	  } else if (request.method === "POST" && url.pathname === "/guests") {
		return createGuest(request, env);
	  } else {
		return new Response("Not Found", { status: 404 });
	  }
	},
  };
  
  async function getGuests(env) {
	const { results } = await env.DB.prepare("SELECT * FROM guests").all();
	return Response.json(results);
  }
  
  async function createGuest(request, env) {
	const { guestname, guestnumber, phonenumber, vege } = await request.json();
	await env.DB.prepare(
	  `INSERT INTO guests (guestname, guestnumber, phonenumber, vege) VALUES (?, ?, ?, ?)`
	).bind(guestname, guestnumber, phonenumber, vege).run();
	
	return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }
  