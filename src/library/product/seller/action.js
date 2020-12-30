
/**
 *
 * @param { { URL: any, SellerID: any, id: any, zipcode: any } } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { URL, SellerID } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const id = (SellerID || inputs.id);
  const zipcode = inputs.zipcode || parameters.zipcode;
  const sellerFound = await execute({ url, id, zipcode });

  if (!sellerFound) {
    console.log('No seller found.');
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
      description: 'direct url for seller',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for seller',
      type: 'string',
      optional: true,
    },
    {
      name: 'SellerID',
      description: 'unique identifier for seller',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/seller/execute',
    extract: 'action:product/seller/extract',
  },
  path: './seller/stores/${store[0:1]}/${store}/${country}/seller',
  implementation,
};
