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
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  for(var i=0; i < 6; i++)
  {
    try {
      await context.click('button[class*="Button__StyledButton"]');
      await context.evaluate(() => {
        let dom = document.querySelector('button[class*="Button__StyledButton"]');
        dom.remove();
     });
    }catch (e) {
      console.log(e);
      break;
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

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
    country: 'CA',
    store: 'telus',
    domain: 'telus.com',
    url: 'https://www.telus.com/en/mobility/{searchTerms}',
    loadedSelector: 'div[id*="catalogue__brand"]',
    noResultsXPath: '//h1[contains(text(),"Looks like we can’t find that page")]',
    zipcode: "''",
  },
  implementation,
};
