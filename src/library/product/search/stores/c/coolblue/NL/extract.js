
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const policyAcceptPopup = await context.evaluate(function () {
      return !!document.evaluate('//button[@name="accept_cookie"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (policyAcceptPopup) {
      await context.click('button[name="accept_cookie"]');
    }
    const applyScroll = async function (context) {
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
  },
};
