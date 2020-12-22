const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },

  implementation: async (inputs,
    parameters,
    context,
    dependencies,) => {
    // const cssProduct = 'ul#menu-product';
    // const cssProductDetails = 'a[data-tab~="opis"]';
    const cssProduct = 'nav#product-nav';
    const cssProductDetails = 'button#expand-specification';

    // const cssProduct = 'section[data-section-id=specyfikacja]';
    // const cssProductDetails = 'button#expand-specification';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout:20000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      const productDescAvailable = await isSelectorAvailable(cssProductDetails);
      await context.waitForSelector(cssProductDetails, { timeout: 10000 });
      if (productDescAvailable) {
        await context.click(cssProductDetails);
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
        await context.waitForSelector(cssProductDetails);
        const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
        console.log(`productDescAvailable: ${productDescAvailable}`);
        if (!productDescAvailable) {
            throw new Error('ERROR: Failed to load product details page');
        }
        console.log('navigation complete!!');
      }
    }

    // const cssProduct1 = 'div#description';
    // const cssProductDetails1 = 'button[data-read-more="Rozwiń pełny opis"]';

    // const isSelectorAvailable1 = async (cssProduct1) => {
    //   console.log(`Is selector available: ${cssProduct1}`);
    //   return await context.evaluate(function (selector) {
    //     return !!document.querySelector(selector);
    //   }, cssProduct1);
    // };

    // console.log('.....waiting......');
    // await context.waitForSelector(cssProduct, { timeout:20000 });

    // const productAvailable1 = await isSelectorAvailable1(cssProduct);
    // //console.log('cssProductDetails1: ${productAvailable1}`);
    // if (productAvailable1) {
    //   console.log('clicking product link');
    //   const productDescAvailable1 = await isSelectorAvailable1(cssProductDetails1);
    //   await context.waitForSelector(cssProductDetails, { timeout: 10000 });
    //   if (productDescAvailable1) {
    //     await context.click(cssProductDetails1);
    //     await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
    //     await context.waitForSelector(cssProductDetails1);
    //     const productDetailsAvailable = await isSelectorAvailable1(cssProductDetails1);
    //     console.log(`productDescAvailable: ${productDescAvailable1}`);
    //     if (!productDescAvailable1) {
    //         throw new Error('ERROR: Failed to load product details page');
    //     }
    //     console.log('navigation complete!!');
    //   }
    // }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};