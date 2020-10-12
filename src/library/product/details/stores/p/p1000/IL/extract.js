
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'p1000',
    transform: null,
    domain: 'p1000.co.il',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if(prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for(let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if(element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const retainAlphaNumbericString = (inputString) => {
        return inputString.replace(/[^a-zA-Z0-9]/g, "");
      }

           //Get Single Value XPATH Extraction
           //xpath for availabilityText
           const availabilityStatusUrl = getXpath("//meta[@itemprop='availability']/@content", 'nodeValue');
           var availabilityStatusValue = 'Outof Stock';
           console.log("My availabilityStatusUrl", availabilityStatusUrl);
           if(availabilityStatusUrl.indexOf('InStock')){
            console.log("Inside availabilityStatusUrl");
             availabilityStatusValue = 'In stock';
           }
           addElementToDocument('added_availabilityText', availabilityStatusValue);


          //xpath for weightNet
          const weightNet = getXpath("//li[contains(@id,'MainContent_Properties_pFreeText')]/text()", 'nodeValue');
          console.log("My weightNet", weightNet);
          console.log("My weightNet", weightNet.substring(5,14));
          addElementToDocument('added_weightNet', weightNet.substring(5,14));


          var map = [];
          map.push({

            key1:'sheetal'
          })

          console.log("My map", map);
          

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

    });
    await context.extract(productDetails);
  },

};
