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
    await context.click('a#CybotCookiebotDialogBodyLevelButtonAccept');
  }catch (e) {
    console.log(e);
  }
    
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

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
    country: 'SE',
    store: 'nordicfeel',
    domain: 'nordicfeel.se',
    url: "https://www.nordicfeel.se/search?q={searchTerms}",
    loadedSelector: "ul[class='row listing--grid'] li[data-impression] div[class *='image--gray'] img",
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
