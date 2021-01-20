
/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  try {
    await context.waitForSelector('button[data-dismiss="modal"].btn-custom, left-btn', { timeout: 1000 });
    await context.click('button[data-dismiss="modal"].btn-custom, left-btn', { timeout: 1000 });
  } catch (e) {

  }

  try {
    await context.waitForSelector('div.pe-optin-6_cancelBtnWrapper>div', { timeout: 1000 });
    await context.click('div.pe-optin-6_cancelBtnWrapper>div', { timeout: 1000 });
  } catch (e) {

  }


  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  await new Promise((resolve, reject) => setTimeout(resolve, 7000));
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
    country: 'CL',
    store: 'telemercados',
    domain: 'telemercados.cl',
    url: 'https://www.telemercados.cl/busca/?ft={searchTerms}',
    loadedSelector: 'div.page',
    noResultsXPath: '//article[@id="main-content"]//h2[contains(text(),"No encontramos resultados para tu búsqueda")]',
    zipcode: '',
  },
  implementation,
};
