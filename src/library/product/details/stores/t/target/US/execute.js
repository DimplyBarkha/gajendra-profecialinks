/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any} } inputs
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
  let { url, id, zipcode } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }

  await dependencies.goto({ url, zipcode });
  await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    document.getElementById('storeId-utilityNavBtn').click();
    await stall(1000);
  });
  await context.setInputValue('#zipOrCityState', zipcode);
  await context.evaluate(async function () {
    document.querySelector('button[data-test="storeLocationSearch-button"]').click();
  });
  await context.waitForXPath("//button[@data-test='storeId-listItem-setStore']");
  await context.evaluate(function () {
    document.querySelectorAll('button[data-test="storeId-listItem-setStore"]')[0].click();
  });

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
    country: 'US',
    store: 'target',
    domain: 'target.com',
  },
  implementation
};
