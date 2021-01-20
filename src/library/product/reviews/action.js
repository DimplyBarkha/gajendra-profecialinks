
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, date: any, days: number, results} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  { zipcode },
  context,
  { execute, extract, paginate },
) {
  const { URL: url, RPC, SKU, date: dateOrigin = null, days = 30, results = 10000 } = inputs;
  const id = RPC || SKU || inputs.id;
  const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

  const date = new Date(days ? new Date().setDate(new Date().getDate() - days) : dateOrigin);
  console.log(`Date Limit: "${date}"`);

  const resultsReturned = await execute({ url, id, zipcode, date, days });

  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  // try gettings some search results
  const pageOne = await extract({});
  // Check added for backward compatibility
  let collected = pageOne.data ? length(pageOne.data) : length(pageOne);

  console.log(`Got initial number of results: ${collected}`);

  // check we have some data
  if (collected === 0) {
    console.log('Was not able to collect any data on the first page');
    return;
  }

  let page = 2;
  while (results > collected && await paginate({ id, page, offset: collected, date })) {
    const results = await extract({});
    // Check added for backward compatibility
    const count = results.data ? length(results.data) : length(results);
    if (count === 0) {
      // no results
      break;
    }
    collected = (results.mergeType && (results.mergeType === 'MERGE_ROWS') && count) || (collected + count);
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
