
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, parentInput: string } } inputs
 * @param { { store: any, country: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { URL, RPC, SKU, parentInput } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const id = (RPC) || ((SKU) || inputs.id);
  const resultsReturned = await execute({ url, id, zipcode: parameters.zipcode });
  if (!resultsReturned) {
    console.log('No results returned');
    return;
  }

  await extract({ url, id, parentInput });
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
      name: 'parentInput',
      description: 'parent input value',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/details/execute',
    extract: 'action:product/details/extract',
  },
  path: './details/stores/${store[0:1]}/${store}/${country}/details',
  implementation,
};
