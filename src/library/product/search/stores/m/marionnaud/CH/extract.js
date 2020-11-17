const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    transform: transform,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    // removing cookies popup
    await context.waitForNavigation();
    const isPopupPresent = await context.evaluate(async () => {
      return document.querySelector('button#onetrust-accept-btn-handler');
    });
    if (isPopupPresent) {
      await context.click('button#onetrust-accept-btn-handler');
    }
    await context.waitForNavigation();

    // load more pagination implementation
    let isLoadMoreButtonPresent = await context.evaluate(async () => {
      const button = document.querySelector('button.more-data-loader__btn');
      if (button) {
        return !button.getAttribute('style');
      } else {
        return false;
      }
    });
    let productsAmount = await context.evaluate(async () => {
      return document.querySelectorAll('div.more-data-loader div.product-tile').length;
    });
    let clicksAmount = 0;
    while (isLoadMoreButtonPresent && productsAmount < 150 && clicksAmount < 15) {
      await context.click('button.more-data-loader__btn span');
      await context.waitForSelector('button.more-data-loader__btn', { timeout: 2000 });
      isLoadMoreButtonPresent = await context.evaluate(async () => {
        return !document.querySelector('button.more-data-loader__btn').getAttribute('style');
      });
      productsAmount = await context.evaluate(async () => {
        return document.querySelectorAll('div.more-data-loader div.product-tile').length;
      });
      clicksAmount++;
    }

    // rank and rankOrganic
    await context.evaluate(() => {
      const products = document.querySelectorAll('div[data-component="MasonryGrid"] div.product-tile__wrapper');
      products.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
      });
    });

    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.productUrl) {
        row.productUrl[0].text = `https://marionnaud.ch${row.productUrl[0].text}`;
      }
      if (row.thumbnail) {
        row.thumbnail[0].text = `https://marionnaud.ch${row.thumbnail[0].text}`;
      }
    });

    return dataRef;
  },
};
