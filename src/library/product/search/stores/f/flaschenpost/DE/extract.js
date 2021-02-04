const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform,
    domain: 'flaschenpost.de',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    var wantedZip = '28203';
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.click('a[class="fp-changeZipCode fp-footer-changeZipCode"]');
    await context.setInputValue('[id="validZipcode"]', wantedZip);
    await context.waitForSelector('button[class="fp-button fp-button--primary zip--button fontSizeL"]', 6000)
    await context.click('button[class="fp-button fp-button--primary zip--button fontSizeL"]');
    const applyScroll = async function (context) {
      await context.evaluate(async () => {
        try {
          // @ts-ignore
          await context.waitForSelector('div[class="fp-productList"]', 6000)
          await new Promise(r => setTimeout(r, 10000));
        } catch (error) {

        }
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

    return await context.extract(productDetails, { transform });
  },
}