const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    transform,
    domain: 'daraz.pk',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
            await stall(1000);
            break;
          }
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
    await context.evaluate(() => {
      const allScriptsTag = document.querySelectorAll('script');
      const allProducts = document.querySelectorAll('div[data-qa-locator*="general-products"] div[data-qa-locator*="product-item"]');
      allScriptsTag.forEach((element, index) => {
        const match = element.innerHTML.match(/window\.pageData\s*=\s*(.+\})/);
        if (match) {
          const jsonData = JSON.parse(match[1]);
          if (jsonData.mods.listItems.length === allProducts.length) {
            for (let i = 0; i < jsonData.mods.listItems.length; i++) {
              allProducts[i].setAttribute('data-item-id', jsonData.mods.listItems[i].sku);
            }
          }
        }
      });
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
