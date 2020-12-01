/**
 *
 * @param { { id: string, url: string, zipcode: string, date: string, days: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string, sortButtonSelectors: string, reviewUrl: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
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
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);
  const noResults = await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);

  if (!noResults) return noResults;

  if (sortButtonSelectors) {
    console.log('Sorting reivews....', sortButtonSelectors);
    const selectors = sortButtonSelectors.split('|');
    for (const [i, selector] of selectors.entries()) {
      console.log(selector, selectors[i + 1]);
      try {
        await context.click(selector);
      } catch (error) {
        await context.evaluate(function (selector) {
          document.querySelector(selector).click();
        }, selector);
      }
      if (i < selectors.length - 1) {
        console.log('waiting for selector', selectors[i + 1]);
        await context.waitForSelector(selectors[i + 1]);
      }
    }
    if (loadedSelector) {
      await context.waitForFunction((sel, xp) => {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }
  }
  return true;
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
      description: 'review url pattern. Ex: https://www.amazon.in/product-reviews/{id} supports {date} and {days} in the url',
    },
    {
      name: 'sortButtonSelectors',
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
