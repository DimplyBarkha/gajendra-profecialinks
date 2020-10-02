const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    transform: transform,
    domain: 'pccomponentes.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 30000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 30000) {
            await stall(8000);
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
    };
    for (let i = 0; i < 10; i++) {
      await applyScroll(context);
      const nextLink = await context.evaluate(() => {
        const zeroResults = document.querySelector(
          "div[id='articleListContent'] p",
        );
        if (zeroResults) return false;
        else return true;
      });
      if (!nextLink) {
        break;
      } else {
        const nextButton = await context.evaluate(() => {
          const Button = document.querySelector('button#btnMore');
          if (Button) return true;
          else return false;
        });
        if (nextButton) { await context.click('button#btnMore', {}, { timeout: 100000 }); }
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      }
    }
    return await context.extract(productDetails, { transform });
  },
};
