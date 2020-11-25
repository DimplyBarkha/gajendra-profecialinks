
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    loadedSelector: null,//'.product-images-slider',
    noResultsXPath: "//h1[contains(@class, 'info-block__header') and contains(text(), 'Страница не найдена')]",
    zipcode: '',
  },
  implementation: async function implementation (
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
  
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    
    const priceDivSelector = 'div[class*="product-card-price"]';

    const isPriceDivLoaded = await context.evaluate(async function (selector, reloadSec, maxTime) {
      //window.scrollTo(0,document.body.scrollHeight);
      async function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      let element = document.querySelector(selector);
      let count = 0;
      while (element === null) {
        count = count + reloadSec;
        element = document.querySelector(selector);
        await timeout(reloadSec);
        if (count >= maxTime) {
          console.log("price div not found");
          return false;
        }
      }
      return true;
    }, priceDivSelector, 500, 40000);

    if (isPriceDivLoaded === false) {
      console.log("price Div not found");
    } else {
      console.log('price Div found');
      //return true;
    }
  
    // TODO: Check for not found?
  }
};
