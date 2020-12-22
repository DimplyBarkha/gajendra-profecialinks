async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ ...inputs, url: destinationUrl });

  const needToAcceptCookies = await context.evaluate(() => {
    return !!document.querySelector('div[id*="accept-cookies"]');
  });
  if (needToAcceptCookies) {
    await context.click('button[class*="rgpd-acceptance"]', { timeout: 7000 });
  }

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
    country: 'FR',
    store: 'cigaretteelec',
    domain: 'cigaretteelec.fr',
    url: 'https://www.cigaretteelec.fr/recherche?search_query={searchTerms}',
    loadedSelector: 'div[class*="component-product-list"]',
    noResultsXPath: '//*[contains(text(),"Vous ne trouvez pas votre produit?")]',
    zipcode: '',
  },
  implementation,
};
