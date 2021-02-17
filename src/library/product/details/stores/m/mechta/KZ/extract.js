const { transform } = require('./format');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(90000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const link = document.querySelector(
      'div[class*="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--no-caps q-focusable q-hoverable cursor-pointer"]',
    );
    console.log('link:: ', link);
    if (link != null) {
      link.click();
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    transform,
    domain: 'mechta.kz',
    zipcode: '',
  },
  implementation,
};
