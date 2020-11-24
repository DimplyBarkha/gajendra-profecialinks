
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
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  const loginPrompt = await context.evaluate(async function() {
    if(document.querySelector("#code-close")) {
      console.log("clicking to close the  prompt")
      document.querySelector("#code-close").click();
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.waitForSelector('input[name=buscador]');
  await context.setInputValue('input[name=buscador]',inputs.keywords);
  await context.click('input[name=buscador]');
  context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  let scrollTop = 0;
  while (scrollTop !== 200000) {
    await stall(500);
    scrollTop += 1000;
    let oldScroll = await context.evaluate(() => {return document.querySelector('.df-results').scrollHeight;});
    await context.evaluate(() => {document.querySelector('.df-results').scrollBy(0, document.querySelector('.df-results').scrollHeight + 1000);});
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    let newScroll = await context.evaluate(() => {return document.querySelector('.df-results').scrollHeight;});
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
    country: 'ES',
    store: 'milar',
    domain: 'milar.es',
    url: 'https://www.milar.es',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
