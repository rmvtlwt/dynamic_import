const server = Deno.listen({ port: 80 });

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn): Promise<void> {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    for await (const eventFile of Deno.readDir(Deno.cwd() + "/events")) {
      const event = await import(`./events/` + eventFile.name);
      console.log(event);
      requestEvent.respondWith(
        event.response
      )
    }
  }
}
