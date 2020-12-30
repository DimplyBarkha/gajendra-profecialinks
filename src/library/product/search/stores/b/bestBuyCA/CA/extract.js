
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    transform: null,
    domain: 'bestbuy.ca',
    zipcode: '',
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

      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(3000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(500);
          break;
        }
      }
      const moreButton = document.evaluate('//main//span[@class="content_3dXxd"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log("moreButton:: ", moreButton.singleNodeValue);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        while (index < 7) {
         
          try {
            moreButton.singleNodeValue.click();
            console.log("more button clicked: ", index);
          } catch (e) { }
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          index++;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
