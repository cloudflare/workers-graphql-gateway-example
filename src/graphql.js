import { graphql, buildSchema } from "graphql";
import DataLoader from "dataloader";

function binary_to_string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

async function decodequery(request) {
  const reader = request.body.getReader();
  let query = "";
  while (true) {
    let { done, value } = await reader.read();
    if (done) {
      break;
    }
    query = query + binary_to_string(value);
  }
  let gql = JSON.parse(query);
  return gql;
}

var schema = buildSchema(`
  type Answer {
    name: String
    type: Int
    data: String
    ttl: Int
  }
  type Query {
    resolve(name: String, type: String): [Answer]
  }
`);

async function resolve(x) {
  let req = await fetch(
    "https://cloudflare-dns.com/dns-query?name=" + x.name + "&type=" + x.type,
    {
      headers: {
        Accept: "application/dns-json"
      }
    }
  );
  let ans = await req.json();
  return ans.Answer;
}

async function batchResolver(keys) {
  return keys.map(id => resolve(id));
}

self.resolvers = new DataLoader(
  keys => batchResolver(keys),
  // custom map function
  q => {
    q.type + q.name;
  }
);

class Root {
  constructor() {}
  async resolve(x) {
    return self.resolvers.load(x);
  }
}

export default async function handleGraphQLRequest(request) {
  let gql = await decodequery(request);
  let response = await graphql(schema, gql.query, new Root());
  return new Response(JSON.stringify(response));
}
