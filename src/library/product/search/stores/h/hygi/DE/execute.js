
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'hygi',
    domain: 'hygi.de',
    url: 'https://www.hygi.de/s/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  // const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords.replace(" ","+")));
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords.split(' ').join('+')));
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
