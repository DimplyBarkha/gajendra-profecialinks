
/**
 *
 * @param { { id: any, sellerId: any, zipcode: any } } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { sellerId } = inputs;
  const { execute, extract } = dependencies;
  // const url = URL;
  const id = inputs.id;
  const zipcode = inputs.zipcode || parameters.zipcode  
  const productFound = await execute({ sellerId, id, zipcode: zipcode });

  if (!productFound) {
    console.log('No product found');
    return;
  }

  await extract({ id, sellerId });
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
  ],
  inputs: [
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: false,
    },
    {
      name: 'sellerId',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {
    execute: 'action:product/sellerInventory/execute',
    extract: 'action:product/sellerInventory/extract',
  },
  path: './sellerInventory/stores/${store[0:1]}/${store}/${country}/sellerInventory',
  implementation,
};
