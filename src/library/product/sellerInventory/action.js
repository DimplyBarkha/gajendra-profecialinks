
/**
 *
 * @param { { id: any, sellerId: any } } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, findSeller: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, sellerId } = inputs;
  const { country, domain, store, zipcode, mergeType } = parameters;
  const { execute, extract, findSeller, paginate } = dependencies;
  const sellerFound = await execute({ id, sellerId, zipcode });

  if (!sellerFound) {
    console.log('No seller found.');
    return;
  }
  let { results, foundSeller } = await findSeller({ id, sellerId });

  console.log('Got initial number of sellers', results);

  // check we have sellers available
  if (results === 0) {
    return;
  }

  let page = 2;
  while (!foundSeller && await paginate({ id, sellerId, page, offset: results })) {
    const data = await findSeller({ id, sellerId });
    const count = data.results;
    foundSeller = data.foundSeller;
    if (count === 0) {
      // no results
      break;
    }
    results = (mergeType && (mergeType === 'MERGE_ROWS') && count) || (results + count);
    page++;
  }
  if (!foundSeller) {
    console.log('No seller found.');
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
    findSeller: 'action:product/sellerInventory/findSeller',
    extract: 'action:product/sellerInventory/extract',
    paginate: 'action:product/sellerInventory/paginate',
  },
  path: './sellerInventory/stores/${store[0:1]}/${store}/${country}/sellerInventory',
  implementation,
};
