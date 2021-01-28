
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { nextLinkSelector, loadedSelector, noResultsXPath, loadedXpath, resultsDivSelector } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) return false;
  }

  if (nextLinkSelector) {
    console.log('Clicking custom', nextLinkSelector);
    await context.click(nextLinkSelector, {}, { timeout: 80000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 80000 });
    }
    if (loadedXpath) {
      await context.waitForXPath(loadedXpath, { timeout: 20000 });
    }
    return true;
  };

  console.log('Checking no results', noResultsXPath);

  if (resultsDivSelector) {
    // counting results
    const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
    console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
    return !!resultNB;
  }

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_papeleria',
    nextLinkSelector: '#pagination-next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.products_list-item:nth-last-child(1)',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //a[@class="product_detail-brand"]',
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation
};
