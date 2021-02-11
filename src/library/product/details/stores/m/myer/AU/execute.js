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
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    /*try{
      await context.waitForSelector('div.select-wrapper > button',{timeout:500});
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      await context.click('div.select-wrapper > button.css-1c31bez');
      await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    }catch(e){
  
    }*/
    
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
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
  await applyScroll(context);

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    domain: 'myer.com.au',
    loadedSelector: "div ol li img[data-automation='product-image']",
    noResultsXPath: "//h1[@data-automation='product-not-found-heading'] | //div[@data-automation='out-of-stock-notification-wrapper']//h3[text()='It looks like that item is out of stock']",
    zipcode: '',
  },
};
