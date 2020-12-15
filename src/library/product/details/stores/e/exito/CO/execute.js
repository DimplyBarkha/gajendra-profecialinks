
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

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(async function () {
    await new Promise(resolve => setTimeout(resolve, 2814));
    const element = document.querySelector('div[role="presentation"]');
    if (element) {
      element.parentNode.removeChild(element);
    }
  });

  // try {
  //   await context.waitForSelector('div[role="presentation"] input#react-select-2-input');
  //   await context.setInputValue('div[role="presentation"] input#react-select-2-input', 'Bello');
  //   await context.click('div[role="presentation"] button.exito-geolocation-3-x-primaryButton');
  //   await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  // } catch (e) {
  //   console.log(e);
  // }

  try {
    await context.click('.exito-components-4-x-showMinusButtonBar');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(e);
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
    country: 'CO',
    store: 'exito',
    domain: 'exito.com',
    loadedSelector: 'h1.product-detail-vtex-store-components-product-name',
    noResultsXPath: "//span[contains(text(),'PAGE NOT FOUND')]",
    zipcode: '',
  },
  implementation,
};
