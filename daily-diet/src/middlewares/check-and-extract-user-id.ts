import { FastifyReply, FastifyRequest } from "fastify";

export async function checkUserToken(req: FastifyRequest, reply: FastifyReply) {
  if (req.routerPath && req.routerPath.startsWith("/auth")) {
    return;
  }

  const userToken = extractJwtTokenFromHeader(req);

  if (!userToken) {
    return reply.status(401).send("Unauthorized.");
  }

  try {
    const decodeToken: any = await req.jwtVerify();

    // Set the userId in the request headers to be used in the route handlers
    req.headers["userId"] = decodeToken.userId;
  } catch (error) {
    return reply.status(401).send("Invalid Token.");
  }
}

function extractJwtTokenFromHeader(req: FastifyRequest): string | undefined {
  const header = req.headers.authorization;

  if (!header) {
    return undefined;
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer") {
    return undefined;
  }

  return token;
}
