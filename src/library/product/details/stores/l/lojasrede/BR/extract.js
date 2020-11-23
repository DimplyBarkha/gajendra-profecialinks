const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    transform: null,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
  implementation,
};

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {

    //for price value
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul[class="neemu-products-container nm-view-type-grid"]>li')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }

    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      }

      const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);   
      const result = []; 
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
      const element = nodeSet.snapshotItem(index);
      if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
      };



      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);       
        let result;      
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];    
        else result = elem ? elem.singleNodeValue : '';    
       return result && result.trim ? result.trim() : result; 
        };

     
      var price_list = getXpath('//div[@class="row product-details"]//strong[@class="skuListPrice"]/text()', 'nodeValue');
      try {
      if(price_list != null)
      {
        price_list = price_list.split(' ')[1]
        price_list = price_list.replace(',','.');
        addElementToDocument('listprice', price_list);
      }
    }
    catch (err) {
    }

      var price = getXpath('//div[@class="row product-details"]//em[@class="valor-por price-best-price"]/strong/text()', 'nodeValue');
      try{
      if(price != null)
      {
        price = price.split(' ')[1]
        price = price.replace(',','.');
        addElementToDocument('price', price);
      }
    }
  catch (err) {
  }

    });
    return await context.extract(productDetails, { transform });
  
}
