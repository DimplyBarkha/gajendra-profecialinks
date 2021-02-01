
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
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1500);
        scrollTop += 500;
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
  /*await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  try{
    await context.waitForSelector('div.-mx-2>div>button',{timeout:500});
    await context.click('div.-mx-2>div>button');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    await applyScroll(context);
  }catch(e){

  }

  try{
    await context.waitForSelector('div.-mx-2>div>button',{timeout:500});
    await context.click('div.-mx-2>div>button');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    await applyScroll(context);
  }catch(e){

  }

  try{
    await context.waitForSelector('div.-mx-2>div>button',{timeout:500});
    await context.click('div.-mx-2>div>button');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    await applyScroll(context);
  }catch(e){

  }*/


  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
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
    country: 'AU',
    store: 'petpost',
    domain: 'petpost.com.au',
    url: 'https://www.petpost.com.au/search?q={searchTerms}',
    loadedSelector: 'div#root>section>div',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
