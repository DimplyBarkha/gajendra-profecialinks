async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);

  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(async (xp) => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&i=amazonfresh&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin]',
    noResultsXPath: 'count(//div[contains(@data-component-type,"s-search-result")])!=0',
  },
  implementation,
};
