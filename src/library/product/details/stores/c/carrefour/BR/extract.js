const { cleanUp } = require('../../../../shared.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'Carrefour',
    transform: cleanUp,
    domain: 'carrefour.com.br',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    // await context.evaluate(async () => {
    //   const a = document.querySelectorAll('script');
    //   let productId;
    //   a.forEach((b) => {
    //     const number = b.textContent.toString().match(/"params":{"id":"(\d+)"/g);
    //     if (number) {
    //       productId = number[0].match(/\d+/g)[0];
    //     }
    //   });
      


    //   fetch('https://www.carrefour.com.br/api/catalog_system/pub/products/search?fq=productId:' + productId)
    //     .then(response => response.json())
    //     .then(data => { document.body.setAttribute('desc', data[0].description); });
    // });
    await context.evaluate(async function () {
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
  });
  try {
    await context.waitForSelector('span[class*="BrandName"]', { timeout: 30000 });
    } catch (error) {
      console.log('error: ', error);
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },

};
