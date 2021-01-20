const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform: transform,
    domain: 'whisky.de',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, content,index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
      }

      const priceSelector=document.querySelectorAll("span[class='article-price-default article-club-hidden'] font font")
      let priceValue;
      for(let i=0;i<=priceSelector.length;i++)
      {
      priceValue=priceSelector[0].childNodes[0].textContent;
      }
      addHiddenDiv('price',priceValue)
    });
    return await context.extract(productDetails, { transform });
  },

};