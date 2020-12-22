module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    domain: 'marionnaud.ch',
    url: 'https://www.marionnaud.ch/de/search?text={searchTerms}',
    loadedSelector: 'div.more-data-loader div.product-tile img.product-tile__image, div[data-ref="masonry-tile"]',
    noResultsXPath: '//section[contains(@data-position, "emptySearchResult")] | //div[@class="masonry GTM_Product_Grid"]',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    let url = parameters.url.replace(
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

    const checkNoResults = async () => {
      console.log('Checking no results', parameters.noResultsXPath);
      return await context.evaluate(function (xp) {
        const r = document.evaluate(
          xp,
          document,
          null,
          XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
          null,
        );
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
      }, parameters.noResultsXPath);
    };

    let hasResults = await checkNoResults();

    if (!hasResults) {
      url = parameters.url.replace(
        '{searchTerms}',
        `%27${encodeURIComponent(inputs.keywords)}%27`,
      );
      await dependencies.goto({ url, zipcode: inputs.zipcode });
    }

    await context.waitForNavigation();
    hasResults = await checkNoResults();
    return hasResults;
  },
};
