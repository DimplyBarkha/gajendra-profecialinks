const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     const specifications = document.querySelector('button[data-at="expansion-panel-header--Specificaties"]');
  //     if (specifications) {
  //       // @ts-ignore
  //       specifications.click();
  //     }
  //   });
  //   return await context.extract(productDetails, { transform: transformParam });
  // },
  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productDetailsLink = await context.evaluate(function (inputs) {
      const productList = document.querySelectorAll('ul.productlist__list > li a');
      for (let i = 0; i < productList.length; i++) {
        // const productCodeEle = productList[i].querySelector('div.is-productCode');
        // if (productCodeEle) {
        //   const productCode = productCodeEle.textContent.trim();
        //   if (productCode.includes(inputs.id)) {
        //     const productDetailsEle = productList[i].querySelector('div.c-offerBox_photo a');
        //     return productDetailsEle ? productDetailsEle.getAttribute('href') : null;
        //   }
        // }
        const productRpc = productList[i].getAttribute('name');
        if (productRpc.includes(inputs.id)) {
          return productList[i].getAttribute('href');
        } else {
          return null;
        }
      }
    }, inputs);
    if (productDetailsLink) {
      console.log('found product');
      const url = productDetailsLink;
      await context.goto(url, {
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      const noProductsFound = await context.evaluate(function (inputs) {
        const noResults = document.querySelector('div.is-noResults');
        return noResults;
      });
      if (noProductsFound) {
        throw new Error('Product not found for the given input');
      }
    }

    // await context.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle0' });
  
    // console.log(JSON.stringify(videos));
    return await context.extract(productDetails, { transform: transformParam });
  },
};
