
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, date: any, days: number, results} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { URL, RPC, SKU, date = null, days = 30, results = Infinity } = inputs;
  const { execute, extract, paginate } = dependencies;
  const { mergeType, zipcode } = parameters;
  const url = URL;
  const id = (RPC) || ((SKU) || inputs.id);
  const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

  const resultsReturned = await execute({ url, id, zipcode, date, days, context });
  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }
  if (!date && days) {
    date = new Date().setDate(new Date().getDate() - days);
  }
  date = new Date(date);
  console.log('Date Limit: ', date);
  const pageOne = await extract({ date, results });
  let collected = length(pageOne.data);

  console.log('Got initial number of results', collected);

  // check we have some data
  if (collected === 0 || pageOne.stop) {
    return;
  }

  let page = 2;
  while (results > collected && await paginate({ id, page, offset: collected, date })) {
    const { data, stop } = await extract({ date, results });
    const count = length(data);
    if (count === 0 || stop) {
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
    paginate: 'action:product/reviews/paginate',
  },
  path: './reviews/stores/${store[0:1]}/${store}/${country}/reviews',
  implementation,
};
