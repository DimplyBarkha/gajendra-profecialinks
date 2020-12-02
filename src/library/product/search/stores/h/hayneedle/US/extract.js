
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'hayneedle',
    transform: null,
    domain: 'hayneedle.US',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 500;
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
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('body > div:nth-child(12) > div > div > div > div > div > div:nth-child(6) > button');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
      }
    });
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
