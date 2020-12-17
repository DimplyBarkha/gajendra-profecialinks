
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, date: any, days: number, results, Brands: any } } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  { mergeType, zipcode },
  context,
  { execute, extract, paginate },
) {
  // const { URL: url, RPC, SKU, date: dateOrigin = null, days = 30, results = 10000 } = inputs;
  const { URL: url, RPC, SKU, date: dateOrigin = null, days = 30, results = 200, Brands } = inputs;
  const id = RPC || SKU || inputs.id;
  const inputUrl = url;
  const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

  const date = new Date(days ? new Date().setDate(new Date().getDate() - days) : dateOrigin);
  console.log(`Date Limit: "${date}"`);

  const resultsReturned = await execute({ url, id, zipcode, date, days, Brands });

  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  const pageOne = await extract({});
  let collected = length(pageOne);

  console.log(`Got initial number of results: ${collected}`);

  // check we have some data
  if (collected === 0) return;

  let page = 2;
  while (results > collected && await paginate({ inputUrl, id, page, offset: collected, date })) {
    const data = await extract({});
    const count = length(data);
    if (count === 0) break; // no results
    collected = (mergeType && (mergeType === 'MERGE_ROWS') && count) || (collected + count);
    console.log('Got more results', collected);
    page++;
  }
}
module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
    },
    {
      name: 'zipcode',
      description: 'to set location',
      optional: true,
    },
    {
      name: 'mergeType',
      description: 'For merge rows results calculation.',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'URL',
      description: 'direct url for product review page',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
    {
      name: 'RPC',
      description: 'rpc for product',
      type: 'string',
      optional: true,
    },
    {
      name: 'SKU',
      description: 'sku for product',
      type: 'string',
      optional: true,
    },
    {
      name: 'date',
      description: 'earliest date to extract a review',
      type: 'string',
      optional: true,
    },
    {
      name: 'days',
      description: 'reviews from last number of days',
      type: 'number',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/reviews/execute',
    extract: 'action:product/reviews/extract',
    paginate: 'action:navigation/paginate',
  },
  path: './reviews/stores/${store[0:1]}/${store}/${country}/reviews',
  implementation,
};
