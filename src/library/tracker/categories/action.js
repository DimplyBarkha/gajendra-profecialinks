// @ts-nocheck

/**
 *
 * @param { { URL: string} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { URL, RPC, SKU, UPC, storeID } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const id = RPC || SKU || UPC || inputs.id;
  const zipcode = inputs.zipcode || parameters.zipcode;
  const storeId = inputs.storeId || storeID || parameters.storeId;

  const newInput = { ...inputs, storeId, zipcode, url, id };

  const resultsReturned = await execute(newInput);
  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  await extract(newInput);
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'domain',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
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
      description: 'url for menu',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:tracker/categories/execute',
    extract: 'action:tracker/categories/extract',
  },
  path: './categories/stores/${store[0:1]}/${store}/${country}/categories',
  implementation,
};
