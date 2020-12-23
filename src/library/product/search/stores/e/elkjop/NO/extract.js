const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform: transform,
    domain: 'elkjop.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button not present');
    }
    try {
      await context.click('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button click failed!');
    }
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('footer[class*="master-foot"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class*="master-foot"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
        if (document.querySelectorAll('div[id*="searchProductsInfo"] div[class*="col-mini-product"] > div').length > 150) {
          break;
        }
      }
    });
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform });
  },
};
