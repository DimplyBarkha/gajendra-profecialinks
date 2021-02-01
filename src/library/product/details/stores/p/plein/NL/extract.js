const { transform } = require('./format');

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   try {
//     await context.waitForSelector('div.owl-item.active img.owl-lazy');
//     //await context.click('div.modal-footer>a.btn-success')
//     //await context.click('div.modal-footer > button')
//   } catch (error) {
//     console.log('cookie pop up not loded', error);
//   }
//   return await context.extract(productDetails, { transform });
// }
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform,
    domain: 'plein.nl',
    zipcode: '',
  },
  // implementation,
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async () => {
      const loadMoreEle = document.querySelector('button.btn.btn-link.product-details-toggle');
      if (loadMoreEle) {
        // @ts-ignore
        loadMoreEle.click();
      }

      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
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
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
