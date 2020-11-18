async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  console.log(`here we come till goto file`)
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  console.log(`here we are crossing the goto file`)
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
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
