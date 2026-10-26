import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

export function createDemoServer() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
  return http.createServer(async (request,response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      const target = path.resolve(root,'.'+(pathname === '/' ? '/proposal.html' : pathname));
      const relative = path.relative(root,target);
      if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part=>part.startsWith('.'))) {
        response.writeHead(403);response.end('Forbidden');return;
      }
      const content = await readFile(target);
      response.writeHead(200,{'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store'});
      response.end(content);
    } catch {
      response.writeHead(404);response.end('Not found');
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createDemoServer();
  const port = Number(process.env.PORT || 4173);
  server.listen(port,'127.0.0.1',()=>console.log(`Lucky Dotcom proposal: http://127.0.0.1:${port}/proposal.html`));
}
