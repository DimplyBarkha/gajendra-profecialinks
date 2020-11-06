
async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://zalando.de/katalog/?q={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );
  await dependencies.goto({ url });
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
  const lang = await context.evaluate(async () => {
    return document.querySelector('div[class*="langNav"] a[href="#"]');
  });
  if (lang) await context.click(lang);
  const langOpt = await context.evaluate(async () => {
    return document.querySelector('label[for="de-m"]');
  });
  if (langOpt) await context.click(langOpt);

  const langSave = await context.evaluate(async () => {
    return document.querySelector('button[class*="_buttonPrimary"]');
  });
  if (langSave) await context.click(langSave);

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
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    url: 'https://zalando.de/katalog/?q={searchTerms}',
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearchResults")] | //div[contains(@class, "404")] | //div[contains(@class, "error")]',
    zipcode: '',
  },
  implementation,
};
