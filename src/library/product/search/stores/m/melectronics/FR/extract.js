const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      async function infiniteScroll() {
        let prevScroll = document.documentElement.scrollTop;

        while (document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 4000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      const moreButton = document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        while (document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue && document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160) {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          const isLimitReached = document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160
          if (isLimitReached) {
            break;
          }
          moreButton.singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          await infiniteScroll();
        }
      } else {
        await infiniteScroll();
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
