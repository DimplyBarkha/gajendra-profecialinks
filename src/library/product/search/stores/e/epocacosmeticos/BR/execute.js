async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  console.log('innn Execute Js');
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode }).then(ex => console.log('Custom sucess in then', ex)).catch(ex => console.log('Custom error in catch', ex));
  await new Promise((resolve) => setTimeout(resolve, 100000));
  // return Promise.resolve('');
  console.log('parameters.loadedSelector => ', parameters.loadedSelector);
  if (parameters.loadedSelector) {
    console.log('innn parameters.loadedSelector');
    await context.waitForFunction(async function (sel, xp) {
      console.log('innn Execute Js ....');
      await new Promise((resolve) => setTimeout(resolve, 35000));
      console.log(document.querySelector(sel));
      // console.log('document.documentElement.outerHTML => ', document.documentElement.outerHTML);
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, null, parameters.loadedSelector, parameters.noResultsXPath);
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
    store: 'epocacosmeticos',
    domain: 'epocacosmeticos.com',
    url: 'https://www.epocacosmeticos.com.br/pesquisa?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="searchrr__buscaVazia"]',
    zipcode: '',
  },
  implementation,

};
