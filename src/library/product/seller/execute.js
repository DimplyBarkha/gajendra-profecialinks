/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId, inputs });

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
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'domain',
      description: 'top private domain (e.g. amazon.com)',
    },
    {
      name: 'loadedSelector',
      description: 'XPath to tell us the page has loaded',
      optional: true,
    },
    {
      name: 'noResultsXPath',
      description: 'XPath to tell us the page has loaded',
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
    {
      name: 'zipcode',
      description: 'set location',
      type: 'string',
      optional: true,
    },
    {
      name: 'storeId',
      description: 'storeId for product/seller',
      type: 'string',
      optional: true,
    },
    {
      name: 'zipcode',
      description: 'zipcode to set  location',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/seller/createUrl',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation,
};
