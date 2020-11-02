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
  await context.waitForFunction('CookieInformation.declineAllCategories()');
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  await context.click('div.wca-batch-1-r1-webchannel-accelerate-ribbon-close');
  await context.click('button.pushcrew-btn-close"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 500));
  await context.click('div.roulette-iframe-close a');
  await new Promise((resolve, reject) => setTimeout(resolve, 500));

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
  console.log('going to call scroll');
  
  console.log('just called call scroll');
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  console.log('after call scroll timeout');
  
  if (parameters.loadedSelector) {
    await applyScroll(context);
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
    country: 'DK',
    store: 'cocopanda',
    domain: 'cocopanda.dk',
    url: 'https://www.cocopanda.dk/search?SearchTerm={searchTerms}',
    loadedSelector: 'main#main-container',
    noResultsXPath: '//main[@id="main-container"]//div[@class="main-content"]/h1[contains(text(),"Vi fandt desværre ingen produkter, der matcher din søgning efter")]',
    zipcode: '',
  },
};
