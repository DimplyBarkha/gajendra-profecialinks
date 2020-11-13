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
    await context.waitForSelector('input[name="SearchTerm"]');
    await context.setInputValue('input[name="SearchTerm"]', inputs.keywords);
    await context.click('input[name="SearchTerm"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(e);
  }
  await context.clickAndWaitForNavigation('div.search-container-sticky button[type="submit"]');

  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);

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

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    domain: 'hoogvliet.com',
    url: 'https://www.hoogvliet.com',
    loadedSelector: 'div.product-list div.product-list-item',
    noResultsXPath: '//div[@class="no-search-result"]',
    zipcode: "''",
  },
  implementation,
};
