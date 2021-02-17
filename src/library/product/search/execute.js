/**
 *
<<<<<<< HEAD
<<<<<<< HEAD
 * @param { { keywords: string, zipcode: string, storeID: string ,query: string} } inputs
=======
 * @param { { keywords: string, zipcode: string, _date: string } } inputs
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
=======
 * @param { { searchURL: string , keywords: string, zipcode: string, storeID: string ,query: string} } inputs
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
<<<<<<< HEAD
<<<<<<< HEAD
  const { keywords, query } = inputs;
=======
  const { searchURL, keywords, query } = inputs;

  console.log(`searchURL: ${searchURL}`);
  url = searchURL || url;
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
  console.log(url);

  if (url.includes('{searchTerms}') && !keywords) throw new Error('No keywords provided');
  if (url.includes('{queryParams}') && !query) throw new Error('No query provided');

  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{queryParams}', query);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  if (loadedSelector) {
=======
  const zipcode = encodeURIComponent(inputs.zipcode)
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: zipcode, inputs });
  if (parameters.loadedSelector) {
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log(`noResultsXPath: ${noResultsXPath}`);
  return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
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
      name: 'url',
      description: 'Open Search search url pattern, e.g. http://example.com/?q={searchTerms}',
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
      name: 'searchURL',
      description: 'search URL',
      type: 'string',
    },
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'id',
      description: 'keywords to search for',
      type: 'string',
    },
    {
<<<<<<< HEAD
      name: 'storeID',
      description: 'Id of the store',
      type: 'string',
      optional: true,
    },
    {
      name: 'query',
      description: 'Part of a URL',
      type: 'string',
      optional: true,
=======
      name: 'zipcode',
      description: 'locale to search within',
      type: 'string',
    },
    {
      name: '_date',
      description: 'earliest date to extract a review',
      type: 'string',
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation,
};
