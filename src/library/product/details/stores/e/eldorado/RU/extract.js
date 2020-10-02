const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform: transform,
    domain: 'eldorado.ru',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    const applyScroll = async function (context) {
      // for (let i = 0; i < 10; i++) {
      //   const nextLink = await context.evaluate(() => {
      //     const nxtButton = document.querySelector(
      //       "div[class='slider-button-next _preview']"
      //     );
      //     if (nxtButton) return true;
      //     else return false;
      //   });
      //   if (!nextLink) {
      //     break;
      //   }
      //   await context.click(
      //     "div[class='slider-button-next _preview']",
      //     {},
      //     { timeout: 10000 }
      //   );
      //   await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      // }
      // for (let i = 0; i < 10; i++) {
      //   const nextLink = await context.evaluate(() => {
      //     const nxtButton = document.querySelector(
      //       "div[class='slider-button-prev _preview']"
      //     );
      //     if (nxtButton) return true;
      //     else return false;
      //   });
      //   if (!nextLink) {
      //     break;
      //   }
      //   await context.click(
      //     "div[class='slider-button-prev _preview']",
      //     {},
      //     { timeout: 10000 }
      //   );
      //   await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      // }
      await context.evaluate(async function () {
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
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });

      const policyAcceptPopup = await context.evaluate(function () {
        return !!document.querySelector(
          'div.goodPicBig > div.slider-buttons > div.slider-button-next',
        );
      });
      if (policyAcceptPopup) {
        await context.click(
          'div.goodPicBig > div.slider-buttons > div.slider-button-next',
        );
      }
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
