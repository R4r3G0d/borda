import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { sanitizeInput } from "./utils";

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  // Санитизация входных данных из URL
  const sanitizedUrl = sanitizeInput(request.url);

  let markup = renderToString(
    <RemixServer context={remixContext} url={sanitizedUrl} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}