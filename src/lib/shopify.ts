const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("\n"));
  }

  return json.data;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: ShopifyImage | null;
  images: {
    edges: { node: ShopifyImage }[];
  };
  collections: {
    edges: { node: { title: string; handle: string } }[];
  };
  metafields: {
    edges: { node: { key: string; value: string; namespace: string } }[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

const COLLECTIONS_WITH_PRODUCTS_QUERY = `
  query GetCollections {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  }
`;

export async function getCollectionsWithProducts(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>({ query: COLLECTIONS_WITH_PRODUCTS_QUERY });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data.product;
}
