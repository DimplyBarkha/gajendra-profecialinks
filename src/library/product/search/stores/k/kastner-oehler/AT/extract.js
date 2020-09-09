const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    transform: transform,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const allProducts = document.querySelectorAll('section#product-list article.en_griditem');
      // const buttons = document.querySelectorAll('span[data-qv-href]');
      console.log(allProducts);
      for (let x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
        // buttons[x].click();
        // let img = document.querySelector('(//div/@data-en-photoswipe-url)[1]');
        // let id = document.querySelector('span[itemprop="sku"]');
        // allProducts[x].setAttribute('img', `${img}`);
        // allProducts[x].setAttribute('id', `${id}`);
        //div.mdl_inner span.close_button.trigger.en_js_close_quickview
      }
    });
    return await context.extract(productDetails);
  },
};
