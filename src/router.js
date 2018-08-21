import handleGraphQLRequest from "./graphql";

export async function handleRequest(request) {
  let u = new URL(request.url);
  switch (u.pathname) {
    case "/graphql":
      return await handleGraphQLRequest(request);
    case "/":
      return await fetch("https://storage.googleapis.com/cfgraphql/index.html");
    case "/graphiql/cfgql.css":
      return await fetch("https://storage.googleapis.com/cfgraphql/cfgql.css");
    case "/graphiql/cfgql.js":
      return await fetch("https://storage.googleapis.com/cfgraphql/cfgql.js");
    default:
      return new Response(JSON.stringify("OK"));
  }
}
