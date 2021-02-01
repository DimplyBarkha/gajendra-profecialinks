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

  try{
    await context.waitForSelector('button#accept-recommended-btn-handler', { timeout: 10000 });
  }
  catch(e){
    console.log('popup not loaded');
  }

  await context.evaluate(async () => {
    if (document.querySelector('button#accept-recommended-btn-handler')) {
      document.querySelector('button#accept-recommended-btn-handler').click();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (document.querySelector('div.js-country__wrapper_DE button.js-selectdestination')) {
      document.querySelector('div.js-country__wrapper_DE button.js-selectdestination').click();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
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
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div[data-testid="productDetailsBlock"],div#pdpMain',
    noResultsXPath: 'div[@id="noreviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
