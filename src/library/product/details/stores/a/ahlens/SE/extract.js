const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));    
    await context.evaluate(async function () {
        function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="ah-image-carousel-nav-wrapper palm-hidden"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      const sliceURL = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":-")) {
            var temp = data[index].replace(":-", "");
          } else if (data[index].includes(":")){
            var temp = data[index].replace(":", ",");
          } else {
            temp = data[index].replace(".", ",");
          }
          addElementToDocument('altImage1', temp);
        }
      };
      var backgroundURL = getAllXpath("(//b[@class='ah-price'])[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":-")) {
            var temp = data[index].replace(":-", "");
          } else if (data[index].includes(":")){
            var temp = data[index].replace(":", ",");
          } else {
            temp = data[index].replace(".", ",");
          }
          addElementToDocument('altImage2', temp);
        }
      };
      var backgroundURL1 = getAllXpath("(((//div[@class='ah-layout__item u-1/2']//span[not(contains(text(),'Rea'))and not(contains(text(),'Medlemspris'))]/following-sibling::b)[1])/text()|(//div[@class='ah-pdp-product-price pt-- mb--']/div[@class='ah-product-price nobreak-ellipsis']/div[1]/span[@class='ah-offer ah-offer--old-price']/text()))", 'nodeValue');
      sliceURL1(backgroundURL1);      
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
