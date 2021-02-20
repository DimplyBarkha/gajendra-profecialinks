async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.planethair.it/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search&items_per_page=96'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );

  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(
      function (sel, xp) {
        return Boolean(
          document.querySelector(sel) ||
            document
              .evaluate(
                xp,
                document,
                null,
                XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
                null,
              )
              .iterateNext(),
        );
      },
      { timeout: 10000 },
      parameters.loadedSelector,
      parameters.noResultsXPath,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));
  const currentUrl = await context.evaluate(async () => {
    if (window !== undefined) { return window.location.href; }
  });

  if (currentUrl.includes('q=keratase&')) {
    await context.goto('https://www.planethair.it/kerastase/?items_per_page=96');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }

  return await context.evaluate(function (xp) {
    const r = document.evaluate(
      xp,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    );
    const e = r.iterateNext();
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    domain: 'planethair.it',
    url: 'https://www.planethair.it/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search&items_per_page=96',
    loadedSelector: 'div.grid-list, div.ty-control-group input[name="q"][value="keratase"]',
    noResultsXPath: '//p[contains(@class, "no-items")]/preceding-sibling::div//input[@name="q"][not(@value="keratase")]',
    zipcode: '',
  },
  implementation,
};
