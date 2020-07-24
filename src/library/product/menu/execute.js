/**
 *
 * @param { { url?: string, zipcode?: any} } inputs
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
    let { url, zipcode } = inputs;
    if (!url) throw new Error('no url provided');

    await dependencies.goto({ url, zipcode });
  
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
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
        description: 'url of product',
        type: 'string',
        optional: true,
      },
      {
        name: 'zipcode',
        description: 'set location',
        type: 'string',
        optional: true,
      },
    ],
    dependencies: {
      goto: 'action:navigation/goto',     
    },
    path: './stores/${store[0:1]}/${store}/${country}/execute',
    implementation,
  };
  