module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    transform: null,
    domain: 'uk.rs-online.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.extract(productDetails);
  },
};