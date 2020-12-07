const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: cleanUp,
    domain: 'unieuro.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {       
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(3000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
       var cookies; 
       cookies = document.querySelector('button[id="onetrust-accept-btn-handler"]')
       if(cookies != undefined){
        // @ts-ignore
        document.querySelector('button[id="onetrust-accept-btn-handler"]').click()
        await new Promise(r => setTimeout(r, 6000));
       }
       
      // Method to Retrieve Xpath content of a Single Node
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const sliceURL = (data2, data3, data4) => {
        var old = ""
        if (data2 != null) old = old + "height" + data2;
        if (data3 != null) old = old + "*depth" + data3;
        if (data4 != null) old = old + "*Width" + data4;
        addElementToDocument('altImages', old);

      };
      // var URL1 = getAllXpath("//div[@class='techs']//span[(text()='Peso dell'imballo')]/following-sibling::span", 'nodeValue');
      var URL2 = getXpath("//div[@class='techs']//span[(text()='Altezza imballo')]/following-sibling::span/text() | //table[@class='flix-std-specs-table']//td[(text()='Altezza con Imballaggio')]/following-sibling::td//text()", 'nodeValue');
      var URL3 = getXpath("//div[@class='techs']//span[(text()='Profondità imballo')]/following-sibling::span/text() | //table[@class='flix-std-specs-table']//td[(text()='Profondità con Imballaggio')]/following-sibling::td//text()", 'nodeValue');
      var URL4 = getXpath("//div[@class='techs']//span[(text()='Larghezza imballo')]/following-sibling::span/text() | //table[@class='flix-std-specs-table']//td[(text()='Larghezza con Imballaggio')]/following-sibling::td//text()", 'nodeValue');
      console.log(URL2)
      sliceURL(URL2, URL3, URL4);

      var name = getXpath('//*[@id="features"]/script//text()', 'nodeValue');
      if (name != null) {
        var img = name.split('brand')[1]
        if (img != null) {
          var img = img.split(",")[0]
          var img = img.slice(6, -7)
          addElementToDocument('brand', img);
        }
      }

    });
    await context.extract(productDetails);
  },
};

