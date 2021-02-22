async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {

  try {
    // @ts-ignore
    await context.waitForSelector('button[id="onetrust-accept-btn-handler"]');
    await context.click('button[id="onetrust-accept-btn-handler"]');
    await new Promise(r => setTimeout(r, 10000));

  } catch (error) {
    console.log('got some error while waiting for the cookie btn', error.message);
  }

  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
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
    country: 'ES',
    store: 'promofarma',
    domain: 'promofarma.com',
    url: 'https://www.promofarma.com/es/search?q={searchTerms}',
    loadedSelector: 'section[class="search-list"] article',
    noResultsXPath: "//div[@class='box-white not-found-box mb-2'] | //*[contains(text(),'Lo sentimos, no hemos encontrado resultados por')] | //*[contains(text(),'No se han encontrado resultados para')]",
    zipcode: '',
  },
  implementation,
};
