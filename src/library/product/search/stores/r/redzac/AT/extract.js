
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    transform: null,
    domain: 'redzac.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        const scrollSelector = document.querySelector('div.infinite_scroll__activity_container');
        do {
          scrollSelector.scrollIntoView();
          await stall(1000);
        }
        // @ts-ignore
        while (scrollSelector.style.cssText === '');
      });
    };
    await applyScroll(context);
    return await context.extract(productDetails);
  },
};
