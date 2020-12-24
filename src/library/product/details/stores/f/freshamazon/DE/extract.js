const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: cleanUp,
    domain: 'freshamazon.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
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
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (data) => {
        var doubleSeparatorText = data.join(' || ');
        return doubleSeparatorText;
      };
      // Single Pipe Concatenation
      const pipeSeparatorSingle = (id, data) => {
        var singleSeparatorText = data.join(' | ');
        addElementToDocument(id, singleSeparatorText);
      };
      var finalDesc = [];
      const aggregateRating = getAllXpath("//div[@id='feature-bullets']/ul/li/span/text()", 'nodeValue');
      if (aggregateRating.length > 0) {
        let liDescBullets = '||' + pipeSeparatorDouble(aggregateRating);
        finalDesc.push(liDescBullets);
      }
      var temp='';
      const descText = document.querySelectorAll('div[id="productDescription"]');
      for (let i = 1; i < descText[0].children.length; i++) {
        // @ts-ignore
        if (descText[0].children[0].innerText == 'Produktbeschreibung') {
          // @ts-ignore
          temp = temp + descText[0].children[i].innerText;
          if (descText[0].children[i + 1].tagName == 'H3') {
            break;
          }
        }
      }
      if (temp.length > 0) {
        finalDesc.push(temp);
      }
      pipeSeparatorSingle('addProductDescription', finalDesc);
    });
    return await context.extract(productDetails, { transform });
  },
};
