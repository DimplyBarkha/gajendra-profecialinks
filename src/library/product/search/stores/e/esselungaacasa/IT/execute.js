async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const homeUrl = 'https://www.esselungaacasa.it/ecommerce/nav/welcome/index.html';
  await context.goto(homeUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });

  await context.setInputValue('input#postcode', '20141');
  await context.click('button[type="submit"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ url: destinationUrl, zipcode });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
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
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'esselungaacasa',
    domain: 'esselungaacasa.it',
    url: 'https://www.esselungaacasa.it/ecommerce/nav/auth/supermercato/home.html#!/negozio/ricerca/{searchTerms}',
    loadedSelector: 'div#mainContent',
    noResultsXPath: '//div[@ng-if="productSetCtrl.emptyProductSet"]',
    zipcode: '',
  },
  implementation,
};
