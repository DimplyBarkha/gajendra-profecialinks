async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);

  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  console.log(`url created is - ${url}`);
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  console.log('waiting for 3 secs to let the page load');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('done waiting');
  if (parameters.loadedSelector) {
    console.log(`loaded selector is in param - ${parameters.loadedSelector}`);
    return await context.evaluate(async (xp) => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return !(document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    }, parameters.loadedSelector);
    // await context.waitForFunction(function (sel, xp) {
    //   return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    // }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(async (xp) => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return !(document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&i=amazonfresh&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin]', // 'div.a-section.aok-relative.s-image-square-aspect',
    noResultsXPath: 'count(//div[contains(@data-component-type,"s-search-result")])!=0',
  },
  implementation,
};
