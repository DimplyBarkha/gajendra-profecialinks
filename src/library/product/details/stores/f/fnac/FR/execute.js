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
  if (id) {
    try {
      await context.waitForSelector('div .articleList div.Article-item article.Article-itemGroup div.Article-itemVisual');
      await context.clickAndWaitForNavigation('div .articleList div.Article-item article.Article-itemGroup div.Article-itemVisual');
    } catch (e) {
      console.log(e);
    }
  }
  try {
    await context.waitForSelector('section#BrandWord div.productStrate__seeMore__container button', { timeout: 1500 });
    // await context.click('div#product-detail li[ae_button_type="tab_specs"]',{timeout:1000});
    await context.evaluate(function () {
      document.querySelector('section#BrandWord div.productStrate__seeMore__container button').click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  } catch (e) {
    console.log(e);
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 12000));
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
    store: 'fnac',
    domain: 'fnac.com',
    loadedSelector: 'div[class~="f-productVisuals-mainIconZoom"]',
    noResultsXPath: '//p[contains(@class,"firstline")]',
    zipcode: '',
  },
  implementation,
};
