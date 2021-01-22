
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    domain: 'lacomer.com.mx',
    url: 'https://lacomer.buscador.amarello.com.mx/searchArtPrior?col=lacomer_2&npagel=20&p=1&pasilloId=false&s={searchTerms}&succId=14#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  await new Promise((resolve, reject) => setTimeout(resolve, 7000));
  const destinationUrl = url.replace(/{searchTerms}/g, encodeURIComponent(keywords));
  console.log("destination "+destinationUrl);
  await dependencies.goto({ url: destinationUrl, zipcode });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}
