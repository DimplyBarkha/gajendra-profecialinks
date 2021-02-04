/**
 *
 * @param { { id: string, url: string, zipcode: string, query: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string, gotoUrlTemplate: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  { url, zipcode, query },
  { loadedSelector, noResultsXPath, gotoUrlTemplate },
  context,
  dependencies,
) {
  const queryReplace = () => {
    if (!gotoUrlTemplate) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = gotoUrlTemplate;
    if (query) tempUrl = tempUrl.replace(/{queryParams}/g, encodeURIComponent(query));
    return tempUrl;
  };

  const destinationUrl = url || queryReplace();
  await dependencies.goto({ url: destinationUrl, zipcode });

  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
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
      name: 'gotoUrlTemplate',
      description: 'template for initial goto if input is not a url',
    },
  ],
  inputs: [
    {
      name: 'zipcode',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'url',
      description: 'review url',
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
