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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const moreButton = document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        let count = 0;
        let scrollTop = 0;
        let lastScrollValue = 0;
        while (document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue && document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160) {
          console.log('count == ', count++);
          console.log('records count ===> ', document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength);
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          while (scrollTop !== 5000) {
            await stall(300);
            lastScrollValue = scrollTop;
            scrollTop += 500;
            window.scroll(lastScrollValue, scrollTop);
            if (scrollTop === 5000) {
              await stall(2000);
              break;
            }
          }
        }
      } else {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
            await stall(500);
            break;
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
