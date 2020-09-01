
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const policyAcceptPopup = await context.evaluate(function () {
      return !!document.evaluate('//button[@data-role="accept-consent"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (policyAcceptPopup) {
      await context.click('button[data-role="accept-consent"]');
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

    const hoverOnEachRecords = async function (context) {
      await context.evaluate(async function () {
        const allItems = document.querySelectorAll('div#opbox-listing--base section article');
        for (let i = 0; i < allItems.length; i++) {
          const mouseoverEvent = new Event('mouseover');
          allItems[i].querySelector('a').dispatchEvent(mouseoverEvent);
        }
      });
    };
    await hoverOnEachRecords(context);
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
