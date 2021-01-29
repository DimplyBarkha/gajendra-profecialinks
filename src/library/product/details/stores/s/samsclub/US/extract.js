const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform: cleanUp,
    domain: 'samsclub.com',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('div[class*="sc-modal sc-modal-background"]>div button[class*="sc-modal-close"], button[class*=close]');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
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
    };
    await applyScroll(context);
    try {
      await context.waitForSelector('div.syndi_powerpage', { timeout: 20000 });
    } catch (error) {
      console.log('error loading enhanced content' + error);
    }
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('.sc-modal-content > div button');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      var enhancedContent = document.querySelector('div.syndi_powerpage');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      if (enhancedContent) {
        const enhancedData = document.createElement('div');
        enhancedData.setAttribute('class', 'enhancedContent');
        // @ts-ignore
        enhancedData.innerHTML = enhancedContent.shadowRoot.querySelector('div').innerHTML;
        document.body.appendChild(enhancedData);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
