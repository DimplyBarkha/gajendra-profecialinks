const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    transform,
    domain: 'keurig.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.click('div#_tealiumModalClose');
    } catch (error) {
      console.log('no sign up modal found');
    }
    await new Promise(resolve => setTimeout(resolve, 3500));
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div.footer-wrapper');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div.footer-wrapper');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.click('div.expand-collapse.collapsed a');
    } catch (error) {
      console.log('see more button not found');
    }
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // addHiddenDiv('servingSize_added', ingredients);
      const spec = document.evaluate('//*[contains(text(),"Specs")]//parent::p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (spec) {
        var specList1;
        let specification = '';

        specList1 = document.evaluate('//*[contains(text(),"Specs")]//parent::p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('specList1', specList1);
        specification = specList1 ? specList1.innerHTML : '';
        addHiddenDiv('specification_added', specification);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
