async function implementation(inputs, parameters, context, dependencies) {
  const { keywords, page, offset } = inputs;
  const {
    nextLinkSelector,
    loadedSelector,
    noResultsXPath,
    mutationSelector,
    spinnerSelector,
    openSearchDefinition,
  } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate(() => {
      const zeroResults = document.querySelector("li[class^='next disabled']");
      const noResults = document.querySelector('li[class^=next]');

      if (zeroResults || noResults == null) return false;
      else return true;
    });
    if (!hasNextLink) {
      return false;
    }
  }

  const { pager } = dependencies;
  const success = await pager({
    keywords,
    nextLinkSelector,
    loadedSelector,
    mutationSelector,
    spinnerSelector,
  });
  if (success) {
    return true;
  }

  let url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url && openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace(
        '{page}',
        (page + (openSearchDefinition.pageOffset || 0)).toString(),
      )
      .replace(
        '{offset}',
        (offset + (openSearchDefinition.indexOffset || 0)).toString(),
      );
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
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
      loadedSelector,
      noResultsXPath,
    );
  }
  console.log('Checking no results', noResultsXPath);
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
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    nextLinkSelector: 'li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "ul[data-dy^='productsList']",
    noResultsXPath: "//div[@class='digi-not-found']",
    openSearchDefinition: null,
    domain: 'eldorado.ru',
    zipcode: '',
  },
  implementation,
};
