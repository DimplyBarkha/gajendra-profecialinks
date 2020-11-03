const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 2000));
  // var isPopupPresent = await context.evaluate(async () => {
  //   return document.querySelector('button#onetrust-accept-btn-handler');
  // });
  // if (isPopupPresent) {
  //   await context.click('button#onetrust-accept-btn-handler');
  // }
  await context.evaluate(async () => {
    // first autoclick button more items
    while (
      document.querySelector('button[class*="b05-less _"]') !== null
    ) {
      // @ts-ignore
      document.querySelector('button[class*="b05-less _"]').click();
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }
    // scroll
    // function stall (ms) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve();
    //     }, ms);
    //   });
    // }

    // scrolling
    // var rawNumber = document.querySelector('div.pagine__count span.pagine__total').textContent;
    // var match = parseInt(rawNumber);

    // let scrollTop = 0;
    // const scrollLimit = match * 150;
    // while (scrollTop <= scrollLimit) {
    //   await stall(1000);
    //   scrollTop += 1000;
    //   window.scroll(0, scrollTop);
    // }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: transform,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation,
};
