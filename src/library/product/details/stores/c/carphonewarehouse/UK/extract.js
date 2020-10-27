const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'carphonewarehouse',
    transform: cleanUp,
    domain: 'carphonewarehouse.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const descriptionText = getAllXpath("//div[contains(@class, 'whatCarphoneSays')]//div[@class='quick']//div[@class='descData']//ul/li", 'innerText').join('||');
      addElementToDocument('added_additional_desc', descriptionText);

      var descriptionName = getXpath("//h1[@id='productTitle']/text()", 'nodeValue');
      var descriptionColor = getXpath("//ul[@id='colourUl']//li[@class='active']//label/text()", 'nodeValue');
      var descriptionModel = getXpath("//ul[@id='capacityUl']//li[@class='active ']//label/text()", 'nodeValue');
      if (descriptionName && descriptionColor && descriptionModel) {
        const description = descriptionName + ' ' + descriptionColor + ' ' + descriptionModel;
        addElementToDocument('added_description', description);
        addElementToDocument('added_variant', descriptionColor + ' ' + descriptionModel);
      }
      const title = getXpath("//meta[@property='og:title']/@content", 'nodeValue');
      const titleList = title.split(' ');
      addElementToDocument('added_brand', titleList[0]);

      const manufacturerDesc = getAllXpath("//div[contains(@class, 'pxInfoTxt')]", 'innerText').join(',');
      addElementToDocument('added_manufacturer_desc', manufacturerDesc);

      var specification = getXpath("//div[@class='deviceSummryDiv']", 'innerText');
      specification = specification.replace('\n \n \n \n \n \n \n \n', ' ');
      addElementToDocument('added_specification', specification);
    });
    await context.extract(productDetails);
  },
};
