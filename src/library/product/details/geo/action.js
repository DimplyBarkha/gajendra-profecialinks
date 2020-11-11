
/**
 *
 * @param { { URL: any, RPC: any, SKU: any, id: any, postcode: any, storeId: any, StoreID: any, Postcode: any, zipcode: any} } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any, useDefault:boolean } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action,prepare: ImportIO.Action,geoExtract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { URL, RPC, SKU, postcode, storeId } = inputs;
  const { execute, extract, prepare, geoExtract } = dependencies;
  const url = URL;
  const id = (RPC) || (SKU) || inputs.id;
  storeId = inputs.StoreID || storeId;
  const zipcode = inputs.Postcode || inputs.zipcode || postcode;
  await execute({ url, id, zipcode, storeId });
  await prepare({ zipcode, storeId });
  if (parameters.useDefault) {
    await extract({ url, id });
  } else {
    await geoExtract({ url, id, storeId, zipcode });
  }
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
      description: '',
      optional: false,
    },
    {
      name: 'useDefault',
      description: '',
      type: 'boolean',
      optional: false,
    },
  ],
  inputs: [
    {
      name: 'URL',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'RPC',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'SKU',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'postcode',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'storeId',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'Postcode',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'StoreID',
      description: '',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/details/execute',
    prepare: 'action:product/details/geo/prepare',
    extract: 'action:product/details/extract',
    geoExtract: 'action:product/details/geo/geoExtract',
  },
  path: '../details/stores/${store[0:1]}/${store}/${country}/geoDetails',
  implementation,
};
