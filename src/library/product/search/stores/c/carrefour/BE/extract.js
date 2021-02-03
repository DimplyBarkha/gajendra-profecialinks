const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(2000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(2000);
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
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    transform,
    domain: 'carrefour.eu',
    zipcode: "''",
  },
  implementation,
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   await context.evaluate(async () => {
  //     function stall(ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }

  //     let scrollTop = 0;
  //     while (scrollTop !== 20000) {
  //       await stall(3000);
  //       scrollTop += 500;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(2000);
  //         break;
  //       }
  //     }
  //     const moreButton = document.evaluate('//li[@class="pagination-next"]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //     console.log("moreButton:: ", moreButton.singleNodeValue);
  //     if (moreButton && moreButton.singleNodeValue != null) {
  //       let index = 0;
  //       while (index < 8) {
         
  //         try {
  //           moreButton.singleNodeValue.click();
  //           console.log("more button clicked: ", index);
  //         } catch (e) { }
  //         await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  //         index++;
  //       }
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // },
};
