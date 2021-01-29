const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const { url, zipcode, storeId } = inputs;
    await context.waitForSelector('td[class="docs depth_0"]>table>tbody>tr', 6000)
    await context.evaluate(async () => {
      function addHiddenDivPrice(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('td[class="regular depth_2"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      var rating = getAllXpath('//td[@class="regular depth_2"]/text()');
      for (let index = 0; index < rating.length; index++) {
        if (rating[index].includes(".")) {
          var temp = rating[index].replace(".", ",");
        } else if (rating[index].includes(",")) {
          var temp = rating[index].replace(",", ",");
        } else {
          temp = rating[index].replace(":-", ",");
        }      
        addHiddenDivPrice('price', temp, index);

      }
    });
    return await context.extract(productDetails, { transform });
  },
}
