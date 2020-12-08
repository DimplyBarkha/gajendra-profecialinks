const { transform } = require('../../samsclub/shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('.sc-modal-content > div button ');
      if (closePopupButton !== null) {
        closePopupButton.click();
        console.log("button clicked");
      }
    });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 500;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
      console.log("scroll");
    };
    await context.evaluate(async () => {
    const closePopupButton1 = document.querySelector('.sc-modal-content > div button');
    if (closePopupButton1 !== null) {
      
      closePopupButton1.click();
      console.log("button clicked");
    }
  },)
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
