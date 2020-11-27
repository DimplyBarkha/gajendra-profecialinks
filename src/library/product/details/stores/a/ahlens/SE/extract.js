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
          if (data[index].includes(":")) {
            var temp = data[index].replace(":", ".");
          } else {
            temp = data[index].replace(":-", ".");
          }
          addElementToDocument('altImage1', temp + "SEK");
        }
      };
      var backgroundURL = getAllXpath("(//b[@class='ah-price'])[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":")) {
            var temp = data[index].replace(":", ".");
          } else {
            temp = data[index].replace(":-", ".");
          }
          addElementToDocument('altImage2', temp + "SEK");
        }
      };
      var backgroundURL1 = getAllXpath("//div[@class='ah-offer-regular']/b[@class='ah-price']/text()", 'nodeValue');
      sliceURL1(backgroundURL1);
      function getUnique(array){
        var uniqueArray = [];
        var i = 0
        // Loop through array values
        for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
        }
        }
        return uniqueArray;
        }
      var images = getAllXpath("//*[@id='pdp-image-carousel-nav']/div/div/li[position()>=2]/img/@src", 'nodeValue');
      if (images != null){
        var uniqueNames = getUnique(images);
        for(var j = 0; j<uniqueNames.length;j++){
          uniqueNames[j]="https://www.ahlens.se"+uniqueNames[j]
          addElementToDocument('altImage', uniqueNames[j]);
        }
        

      }

    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
