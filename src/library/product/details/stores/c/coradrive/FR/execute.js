
/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  const newUrl = await context.evaluate(async () => {
    const url = document.querySelector('div[class*="grille"] > div[class*="col1"]  a[class*="picture"]');
    // @ts-ignore
    return url ? url.href : '';
  });
  console.log('Updated url is', newUrl);
  if (newUrl) {
    await dependencies.goto({ url: newUrl, zipcode, storeId });
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // TODO: Check for not found?
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    domain: 'coradrive.fr',
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(),"Aucun résultat n’a été trouvé")]',
    zipcode: '',
  },
  implementation,
};
