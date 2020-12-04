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

  const iframeUrl = await context.evaluate(async function () {
    return document.querySelector('div.syndy-nutrients iframe').getAttribute('src');
  });
  const URL = await context.evaluate(async function () {
    return window.location.href;
  });
  if (iframeUrl) {
    await context.goto(iframeUrl.toString());
  }
  const nutrients = await context.evaluate(async function () {
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue + '|');
      }
      return result;
    };
    // enhanced\_content
    const nutrientsXpath = getAllXpath('//table[@class="widget__table"]//tr', 'innerHTML');
    return nutrientsXpath;
  });
  await context.goto(URL.toString());
  await context.evaluate(async (nutrients) => {
    console.log(nutrients);
    const tmpData = document.createElement('div');
    tmpData.setAttribute('id', 'iframe_data');
    tmpData.innerHTML = nutrients;
    document.body.appendChild(tmpData);
  }, nutrients);

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
    country: 'NL',
    store: 'coop',
    domain: 'coop.nl',
    loadedSelector: 'div.primeDetails',
    noResultsXPath: "//h1[contains(text(),'We kunnen de pagina die je zoekt niet vinden of het product dat je')]",
    zipcode: '',
  },
  implementation,
};
