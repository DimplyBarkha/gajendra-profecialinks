const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: transform,
    domain: 'walmart.com',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    try{
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());        
    }catch(err){
      console.log('Captcha did not load');
    }
    async function addUrl() {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      const node = document.querySelector("script[id='searchContent']");
      if (node && node.textContent) {
        const jsonObj = node.textContent.startsWith('{"searchContent":') ? JSON.parse(node.textContent) : null;
        if (jsonObj && jsonObj.searchContent && jsonObj.searchContent.preso && jsonObj.searchContent.preso.items) {
          jsonObj.searchContent.preso.items.forEach(item =>
            document.querySelector(`a[class*="product-title-link"][href*="${item.usItemId}"]`) ? document.querySelector(`a[class*="product-title-link"][href*="${item.usItemId}"]`).setAttribute('added-brand', item.brand ? item.brand[0] : '') : '')
          
        }
      }
    }

    await context.evaluate(addUrl);

    // await context.clickAndWaitForNavigation('a[data-automation-id="primary-stack-recall-see-all-button"] span')
    //   .catch(() => {
    //     console.log('no extra page results');
    //   });

    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
