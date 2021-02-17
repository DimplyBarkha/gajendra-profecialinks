/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, zipcode: string } } inputs
 * @param { { store: any, country: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { execute, extract } = dependencies;
  const resultsReturned = await execute(inputs);
  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  await extract(inputs);
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
      name: 'storeID',
      description: 'Id of the store',
      type: 'string',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'URL',
      description: 'direct url for product',
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
      name: 'zipcode',
      description: 'zipcode',
      type: 'string',
      optional: true,
    },
    {
      name: 'storeID',
      description: 'Id of the store',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/media/execute',
    extract: 'action:product/media/extract',
  },
  path: './media/stores/${store[0:1]}/${store}/${country}/media',
  implementation,
};
