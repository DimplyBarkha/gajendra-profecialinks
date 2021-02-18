const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[itemprop='name']")[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      //custom code to concatenate
      var manufacturerDesc = getAllXpath("//div[@class='wc-rich-content-description']//text()", "nodeValue");
      let final_manufacturerDesc = '';
      for (let index = 0; index < manufacturerDesc.length; index++) {
        final_manufacturerDesc += manufacturerDesc[index];
      }
      console.log('Saipavan' + final_manufacturerDesc);
      addHiddenDiv('final_manufacturerDesc', final_manufacturerDesc);
    });
    return await context.extract(productDetails, { transform });
  },
};