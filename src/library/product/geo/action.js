
/**
 *
 * @param { { URL: any, id: any, RPC: any, SKU: any, zipCode: any, storeID: any } } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, setStore: ImportIO.Action, setZipCode: ImportIO.Action, createGeoSpecificUrl: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { URL, RPC, SKU, zipCode, storeID } = inputs;
  const { zipcode } = parameters;
  const { execute, extract, setZipCode, setStore, createGeoSpecificUrl } = dependencies;
  const id = (RPC) || ((SKU) || inputs.id);
  const geoParam = zipCode || storeID;

  if (zipcode) {
    await setZipCode({ url: URL, zipcode });
  }

  const storeIsSet = await setStore({ url: URL, id, geoParam });

  const url = await (storeIsSet !== 'needGeoSpecificUrl' ? URL : createGeoSpecificUrl({ id, geoParam }));

  await execute({ url: url || URL, id });

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
      name: 'SKU',
      description: 'sku for product',
      type: 'string',
      optional: true,
    },
    {
      name: 'zipCode',
      description: 'location identifier to find shop',
      type: 'string',
      optional: true,
    },
    {
      name: 'storeID',
      description: 'unique identifier for a shop',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/details/execute',
    extract: 'action:product/details/extract',
    setZipCode: 'action:navigation/goto/setZipCode',
    setStore: 'action:product/geo/setStore',
    createGeoSpecificUrl: 'action:product/geo/createGeoSpecificUrl',
  },
  path: './geo/stores/${store[0:1]}/${store}/${country}/geo',
  implementation,
};
