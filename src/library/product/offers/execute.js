/**
 *
 * @param { { id: string, url: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string, sortButtonSelector: string, offerUrl: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let url;
  if (inputs.url) {
    url = inputs.url;
  } else if (parameters.offerUrl && inputs.id) {
    url = parameters.offerUrl.replace(/{id}/g, inputs.id);
  }
  await dependencies.goto({ url, zipcode: inputs.zipcode });

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
    {
      name: 'offerUrl',
      description: 'review url pattern. Ex: https://www.amazon.ca/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10',
    },
  ],
  inputs: [
    {
      name: 'zipcode',
      description: 'zipcode',
      type: 'string',
    },
    {
      name: 'url',
      description: 'offer url',
    },
    {
      name: 'id',
      description: 'product id',
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation,
};
