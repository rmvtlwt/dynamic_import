const server = Deno.listen({ port: 80 });

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn): Promise<void> {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    for await (const Island of Deno.readDir(Deno.cwd() + "/islands")) {
      const island = await import(`./islands/` + Island.name);
      console.log(island);
      requestEvent.respondWith(
        island.response
      )
    }
  }
}
