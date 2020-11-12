const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform: cleanUp,
    domain: 'medpex.de',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div#product-list div.product-list-entry.data-tracking-product form')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll('div#product-list div.data-tracking-product');
      const URL = window.location.href;
      for (let i = 0; i < product.length; i++) {
        let aggrating = product[i].querySelector('form > div.clearfix > div.description > div.product-icons > div.rating > a');
        // @ts-ignore
        aggrating = aggrating !== null ? aggrating.classList : '';
        aggrating = aggrating[2] !== undefined ? aggrating[2].split('-')[2] : '';
        // @ts-ignore
        const productUrl = product[i].querySelector('span.product-name b a').href;
        // @ts-ignore
        const price=document.querySelectorAll('span.normal-price')[i].innerText;
        addHiddenDiv('pd_productUrl', productUrl, i);
        addHiddenDiv('pd_url', URL, i);
        addHiddenDiv('pd_aggregateRating', aggrating, i);
        addHiddenDiv('price',price,i)

      }
    });
    return await context.extract(productDetails, { transform });
  },
};
