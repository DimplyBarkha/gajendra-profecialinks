module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    nextLinkSelector: 'a[title="nächste Seite"]:not([class*="disabled"])',
    // nextLinkXpath: '//a[@title="nächste Seite" and not(contains(@class, "disabled"))]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(), "Versuche es mit einem anderen Suchbegriff oder prüfe die Schreibweise")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { nextLinkSelector, loadedSelector, noResultsXPath } = parameters;
    const nextPageUrl = await context.evaluate(
      async (nextLinkSelector) =>
        document.querySelector(nextLinkSelector) ? document.querySelector(nextLinkSelector).href : '',
      nextLinkSelector,
    );
    if (!nextPageUrl) return false;
    console.log('Going to url', nextPageUrl);
    await dependencies.goto({ ...inputs, url: nextPageUrl });

    if (loadedSelector) {
      await context.waitForFunction(
        function (sel, xp) {
          return Boolean(
            document.querySelector(sel) ||
              document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
          );
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    console.log('Checking no results', noResultsXPath);

    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const e = r.iterateNext();
      return !e;
    }, noResultsXPath);
  },
};
