const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    transform: transform,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
  // implementation,
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

    //for rank
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

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);       
        let result;      
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];    
        else result = elem ? elem.singleNodeValue : '';    
       return result && result.trim ? result.trim() : result; 
        };

        
    let PageNumberResult;
    let url = window.location.href;
    let checkPageNumber = url.split('&')[1];
    try {
      if (checkPageNumber.startsWith('page=')) {
        PageNumberResult = checkPageNumber.replace('page=', '');
      }
    }
    catch (err) {
    }
    
    var PageNumber = Number(PageNumberResult);
    PageNumberResult  = PageNumberResult + 1
    if(price != null)
    {
      price = price.replace(',','.');
      addElementToDocument('price', price);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}