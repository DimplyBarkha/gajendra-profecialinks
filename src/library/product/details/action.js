/**
 *
<<<<<<< HEAD
 * @param { { URL: string, parentInput: string, id: any, RPC: string, UPC: any, SKU: string, zipcode: string, storeID: string, storeId: string } } inputs
 * @param { { store: any, country: any, zipcode: any, storeId: any } } parameters
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
=======
 * @param { { URL: string, id: any, RPC: string, SKU: string, zipcode: any } } inputs
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
  const { URL, RPC, SKU, } = inputs;
  const { execute, extract } = dependencies;
  const url = URL;
  const id = (RPC) || ((SKU) || inputs.id);
  const zipcode = inputs.zipcode || parameters.zipcode  
  const productFound = await execute({ url, id, zipcode: zipcode });

  if (!productFound) {
    console.log('No product found');
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
    return;
  }

  await extract(newInput);
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
      name: 'UPC',
      description: 'UPC for product',
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
      name: 'parentInput',
      description: 'parent input value',
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
    execute: 'action:product/details/execute',
    extract: 'action:product/details/extract',
  },
  path: './details/stores/${store[0:1]}/${store}/${country}/details',
  implementation,
};
