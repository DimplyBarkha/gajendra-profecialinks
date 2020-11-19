/**
 *
 * @param { { url?: string,  id?: string, sellerId?: string } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { sellerInventory } = dependencies;
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await parameters.getStockFunc({ context, sellerId: inputs.sellerId, id: inputs.id });
  return await context.extract(sellerInventory, { transform });
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
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
    {
      name: 'loadedSelector',
      description: 'selector to wait for after navigation from find seller',
      optional: true,
    },
    {
      name: 'noResultsXPath',
      description: '',
      optional: false,
    },
    {
      name: 'getStockFunc',
      description: 'function to get stock',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of seller',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for seller',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    sellerInventory: 'extraction:product/sellerInventory/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
