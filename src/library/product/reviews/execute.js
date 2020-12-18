/**
 *
<<<<<<< HEAD
 * @param { { id: string, url: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string, sortButtonSelector: string, reviewUrl: string } } parameters
=======
 * @param { { id: string, url: string, zipcode: string, date: string, days: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string, sortButtonSelectors: string, reviewUrl: string } } parameters
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
<<<<<<< HEAD
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let url;
  if (inputs.url) {
    url = inputs.url;
  } else if (parameters.reviewUrl && inputs.id) {
    url = parameters.reviewUrl.replace(/{id}/g, inputs.id);
  }
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  if (parameters.sortButtonSelector) {
    const selectors = parameters.sortButtonSelector.split('|');
=======
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const patternReplace = () => {
    if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = reviewUrl;
    if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    return tempUrl;
  };
  const destinationUrl = url || patternReplace();

  await dependencies.goto({ url: destinationUrl, zipcode });

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
<<<<<<< HEAD
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
=======
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
<<<<<<< HEAD
  }, parameters.noResultsXPath);
=======
  }, noResultsXPath);
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
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
      name: 'reviewUrl',
<<<<<<< HEAD
      description: 'review url pattern. Ex: https://www.amazon.in/product-reviews/{id}',
    },
    {
      name: 'sortButtonSelector',
=======
      description: 'review url pattern. Ex: https://www.amazon.in/product-reviews/{id} supports {date} and {days} in the url',
    },
    {
      name: 'sortButtonSelectors',
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
      description: 'Button to click to sort if url doesn\'t has options',
      optional: true,
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
