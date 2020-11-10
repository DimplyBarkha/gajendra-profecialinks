const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: cleanUp,
    domain: 'unieuro.it',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('section[class="collapsed"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
        }
      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('p=')) {
          rankOrganic = checkPageNumber.replace('p=', '');
        }
      }
      catch (err) {
      }      
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (parseInt(rankOrganic) * 24) + 1;
      }
      const urlProduct = document.querySelectorAll('section[class="collapsed"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      } 
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
        };
        var backgroundURL = getXpath('//iframe[@id="esw_storage_iframe"]/@src' , 'nodeValue'); 
        var xyz = backgroundURL.split("=");
        xyz.shift();
        var zz = xyz.join();
        zz = zz.replaceAll(",","="); 
        addElementToDocument('url', zz);
    });
    return await context.extract(productDetails, { transform });
  },
};