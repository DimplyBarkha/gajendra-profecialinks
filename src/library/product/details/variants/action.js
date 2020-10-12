
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string } } inputs
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
  const { URL, RPC, SKU, rpc } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const id = (RPC) || ((SKU) || (rpc) || inputs.id);
  const resultsReturned = await execute({ url, id, zipcode: parameters.zipcode });

  if (!resultsReturned) {
    console.log('No results returned');
    return;
  }

  await extract({ url, id });
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
      name: 'rpc',
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
  ],
  dependencies: {
    execute: 'action:product/details/execute',
    extract: 'action:product/details/variants/variantsExtract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/variants',
  implementation,
};
