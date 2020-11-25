const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'leshopFr',
    transform: transform,
    domain: 'leshop.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForFunction(function () {
      return Boolean(document.querySelector('main[id="main"]') || document.evaluate('//main[@id="main"]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 90000 });

    await context.waitForFunction(async function () {
      while(!!document.querySelector('div[class="btn-view-more-products ng-star-inserted"]>button')){
        // @ts-ignore
        document.querySelector('div[class="btn-view-more-products ng-star-inserted"]>button').click()
        await new Promise(r => setTimeout(r, 6000));
      }
      
      var elem, scrollTotalHeight;
      elem = document.querySelector('main[id="main"]');
      await scroll();
      async function scroll() {
        while (elem.scrollTop !== elem.scrollHeight) {
          await stall(500);
          elem.scrollTop += 500;
          window.scroll(0, elem.scrollTop);
          if (elem.scrollTop + elem.offsetHeight === elem.scrollHeight) {
            scrollTotalHeight = elem.scrollTop + elem.offsetHeight
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
      }
      if (scrollTotalHeight === elem.scrollHeight) {
        return Boolean(true);
      }
    }, { timeout: 90000 });

    await context.evaluate(async () => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      
    });
    return await context.extract(productDetails, { transform });
  },
};

