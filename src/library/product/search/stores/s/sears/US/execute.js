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
  console.log('params', parameters, inputs);

  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  await context.waitForSelector('input[name=keyword]');
  await context.setInputValue('input[name=keyword]',inputs.keywords);
  await context.click('input[name=keyword]');
  context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  let scrollTop = 0;
  while (scrollTop !== 200000) {
    await stall(500);
    scrollTop += 1000;
    let oldScroll = await context.evaluate(() => {return document.querySelector('.gallery-table ng-scope').scrollHeight;});
    await context.evaluate(() => {document.querySelector('.gallery-table ng-scope').scrollBy(0, document.querySelector('.gallery-table ng-scope').scrollHeight + 1000);});
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    let newScroll = await context.evaluate(() => {return document.querySelector('.gallery-table ng-scope').scrollHeight;});
    if (newScroll === oldScroll || scrollTop == 200000) {
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

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);

  //end here
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
    country: 'US',
    store: 'sears',
    domain: 'sears.com',
    url: 'https://www.sears.com/search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
};