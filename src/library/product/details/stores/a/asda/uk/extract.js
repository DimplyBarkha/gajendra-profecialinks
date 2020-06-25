
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform: null,
    domain: 'groceries.asda.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const cssProduct = "div.search-page-content__products-tab-content ul.co-product-list__main-cntr li.co-item a[data-auto-id='linkProductTitle']";
    const cssProductDetails = 'div.pdp-main-details';

    const isProductAvailable = async () => {
      console.log(`isProductAvailable: ${cssProduct}`);
      return await context.evaluate(function (cssProduct) {
        return !!document.querySelector(cssProduct);
      }, cssProduct);
    };

    const isProductDetailsAvailable = async () => {
      console.log(`isProductDetailsAvailable: ${cssProductDetails}`);
      return await context.evaluate(function (cssProductDetails) {
        return !!document.querySelector(cssProductDetails);
      }, cssProductDetails);
    };

    console.log('.....waiting......');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const productAvailable = await isProductAvailable();
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await context.click(cssProduct);
      console.log('waiting for page load after click......');
      await new Promise(resolve => setTimeout(resolve, 10000));
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isProductDetailsAvailable();
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
      console.log('navigation complete!!');
    }
    await context.extract(productDetails);
  },
};
