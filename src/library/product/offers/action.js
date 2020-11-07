
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, results: number, zipcode: any } } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any, defaultResults: number } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { URL, RPC, SKU } = inputs;
  const { execute, extract, paginate } = dependencies;
  const { country, store, domain, defaultResults, mergeType } = parameters;
  const url = URL;
  const id = (RPC) || ((SKU) || inputs.id);
  const zipcode = parameters || inputs.zipcode;
  const results = inputs.results || defaultResults || 100;
  // TODO: consider moving this to a reusable function
  const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);
  console.log('zip:' + zipcode);
  // do the search
  const resultsReturned = await execute({ url, id, zipcode });

  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  // try gettings some search results
  const pageOne = await extract({});

  let collected = length(pageOne);

  console.log('Got initial number of results', collected);

  // check we have some data
  if (collected === 0) {
    return;
  }

  let page = 2;
  while (collected < results && await paginate({ id, page, offset: collected })) {
    const data = await extract({});
    const count = length(data);
    if (count === 0) {
      // no results
      break;
    }
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
      name: 'defaultResults',
      description: 'default results value.',
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
      name: 'results',
      description: 'the minimum number of results required',
      type: 'number',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/offers/execute',
    paginate: 'action:product/offers/paginate',
    extract: 'action:product/offers/extract',
  },
  path: './offers/stores/${store[0:1]}/${store}/${country}/offers',
  implementation,
};
