const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: transform,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {

      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class*="product-image"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      //const ean = getXpath('//*[@id="content-wrapper"]/div[1]/div[2]/script[2]/text()', 'nodeValue');
      const ean = document.querySelectorAll("div.main-content > script:nth-child(6)");
      // @ts-ignore
      let jsonData=ean[0].innerText;
      let splitJsonData=jsonData.split('"impressions":')[1];
      let splitJsonData2=splitJsonData.split('"position":30')[0];
      splitJsonData2=splitJsonData2+'"position":30}]';
      splitJsonData2=JSON.parse(splitJsonData2);
      for (var i = 0; i < splitJsonData2.length; i++) {
          addHiddenDiv('ean', splitJsonData2[i].ean, i);
          addHiddenDiv('id', splitJsonData2[i].simpleId, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
