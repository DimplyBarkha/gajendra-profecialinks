const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: cleanUp,
    domain: 'promofarma.com',
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
        const originalDiv = document.querySelectorAll('article[data-qa-ta="couponItem"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDivrating(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('article[data-qa-ta="couponItem"]')[index];
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
        if (checkPageNumber.startsWith('page=')) {
          rankOrganic = checkPageNumber.replace('page=', '');
        }
      }
      catch (err) {
      } 
      
      var dup = Number(rankOrganic);
      dup = dup-1;

      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (dup * 60) + 1;
      }
      const urlProduct = document.querySelectorAll('article[data-qa-ta="couponItem"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
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
        var rating = getAllXpath('//div[@itemprop="aggregateRating"]/meta[@itemprop="ratingValue"]/@content');
        for (var i=0; i < rating.length; i++) {
          (rating[i/2]);
        }
        
        console.log(rating = rating.map(x => x/2))
        for (var j=0; j <rating.length; j++){  
          addHiddenDivrating('ratings', rating[j],j)      
        }
        
      
    });
    return await context.extract(productDetails, { transform });
  },
}