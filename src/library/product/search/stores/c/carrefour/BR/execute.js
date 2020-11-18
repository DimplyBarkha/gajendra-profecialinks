async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  try {
    await context.waitForSelector('div[class*="galleryItem"', { timeout: 40000 });
    console.log('selector loaded successfully');
    return true;
  } catch (e) {
    console.log(`selector did not load at all`)
  }
  // if (parameters.loadedSelector) {
  //   await context.waitForFunction(function (sel, xp) {
  //     return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //   }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  // }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    domain: 'carrefour.com.br',
    url: 'https://mercado.carrefour.com.br/busca/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"layout")]/div[contains(@class,"searchNotFound")]',
    zipcode: '',
  },
  implementation,
};
