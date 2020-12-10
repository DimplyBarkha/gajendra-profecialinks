
/**
 *
 * @param { { id: any, sellerId: any, zipcode: any, url: any } } inputs
 * @param { { country: any, domain: any, store: any, loadedSelector: any, noResultsXPath: any, sellerInventoryUrl: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { id, sellerId, zipcode, url } = inputs;
  const { sellerInventoryUrl } = parameters;
  console.log('params:', parameters);
  console.log('inputs:', inputs);

  if (sellerInventoryUrl && id && sellerId) {
    url = sellerInventoryUrl.replace(/{id}/g, id).replace(/{sellerId}/g, sellerId);
  }
  if (!url && !sellerId && sellerInventoryUrl && id) {
    url = sellerInventoryUrl.replace(/{id}/g, id).replace(/{sellerId}/g, '');
  }
  await dependencies.goto({ url, zipcode });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
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
      name: 'loadedSelector',
      description: '',
      optional: false,
    },
    {
      name: 'noResultsXPath',
      description: '',
      optional: false,
    },
    {
      name: 'sellerInventoryUrl',
      description: '',
      optional: false,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
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
    {
      name: 'zipcode',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation,
};
