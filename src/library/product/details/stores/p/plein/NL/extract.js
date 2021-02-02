const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const {url, id } = inputs;
  console.log("parameters:: ", parameters);
  // try {
  //   await context.waitForSelector('div.owl-item.active img.owl-lazy');
  //   // await context.click('div.modal-footer>a.btn-success')
  //   // await context.click('div.modal-footer > button')
  // } catch (error) {
  //   console.log('cookie pop up not loded', error);
  // }
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//div[@class="clear product-grid-view"]//a[@class="umbrella"]');

    await context.waitForSelector('div.row a.umbrella');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('div.row a.umbrella');
      firstItem.click();
    });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform,
    domain: 'plein.nl',
    zipcode: '',
  },
  implementation,
};
// implementation: async (inputs,
//   parameters,
//   context,
//   dependencies,
// ) => {
//   await context.evaluate(async () => {
//     const loadMoreEle = document.querySelector('button.btn.btn-link.product-details-toggle');
//     if (loadMoreEle) {
//       // @ts-ignore
//       loadMoreEle.click();
//     }

//     let scrollTop = 0;
//     while (scrollTop !== 20000) {
//       await stall(500);
//       scrollTop += 1000;
//       window.scroll(0, scrollTop);
//       if (scrollTop === 20000) {
//         await stall(5000);
//         break;
//       }
//     }
//     function stall (ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//   });
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.extract(productDetails, { transform });
// },
