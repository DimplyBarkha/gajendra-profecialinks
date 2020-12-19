module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    loadedSelector: null, // '.product-images-slider',
    noResultsXPath: "//h1[contains(@class, 'info-block__header') and contains(text(), 'Страница не найдена')] | //*[@class='low-relevancy'][contains(text(),'результатов не найдено')]",
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
      // window.scrollTo(0,document.body.scrollHeight);
      async function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      let element = document.querySelector(selector);

      function findProperty () {
        // @ts-ignore
        return window.dataLayer && window.dataLayer.find(e => Object.prototype.hasOwnProperty.call(e, 'ecommerce'));
      };

      let priceFromDataLayer = findProperty() &&
                    findProperty().ecommerce.detail &&
                    findProperty().ecommerce.detail.products[0] &&
                    findProperty().ecommerce.detail.products[0].price;

      let count = 0;
      while (element === null) {
        if (priceFromDataLayer || priceFromDataLayer === 0) {
          console.log(`priceFromDataLayer found... : ${priceFromDataLayer}`);
          return true;
        } else {
          console.log(`priceFromDataLayer is not found yet... : ${priceFromDataLayer}`);
        }

        priceFromDataLayer = findProperty() &&
                        findProperty().ecommerce.detail &&
                        findProperty().ecommerce.detail.products[0] &&
                        findProperty().ecommerce.detail.products[0].price;

        count = count + reloadSec;
        element = document.querySelector(selector);
        await timeout(reloadSec);
        if (count >= maxTime) {
          console.log('price div not found');
          return false;
        } else {
          console.log('Waiting price div to load...');
        }
      }
      return true;
    },
    priceDivSelector, 500, 10000);

    if (isPriceDivLoaded === false) {
      console.log('price Div not found');
    } else {
      console.log('price Div found');
    }
    return true;
  },
};
