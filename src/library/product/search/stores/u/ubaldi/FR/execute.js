
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    domain: 'ubaldi.fr',
    url: 'https://www.ubaldi.com/recherche/{searchTerms}-page-1.php?from_filtres=true',
    // loadedSelector: 'div[id="main-liste-articles"] > div div[class="la-image-container"] img',
    // noResultsXPath: '//div[@class="recherche-vide"]/span[contains(text(), "La recherche")]',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords.replace(' ', '-')));
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
