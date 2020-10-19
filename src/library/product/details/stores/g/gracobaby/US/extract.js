
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    transform: null,
    domain: 'gracobaby.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Java Script Code for adding new Div
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
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
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addHiddenDiv(id, doubleSeparatorText);
      };
      const addDescBulletInfo = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      // Java Script Code to retrieve Xpath for Aggregate Rating
      var xpathAggregateRating = function (xpathToExecute) {
        var data = '';
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
          data = nodesSnapshot.snapshotItem(i).textContent;
          data = data.substring(data.indexOf('dimension51":') + 14);
          data = data.substring(0, data.indexOf(',') - 1);
          addHiddenDiv('graco_availability', data);
        }
      };
      // Java Script Code to retrieve Xpath for Dimensions
      var xpathDimensions = function (xpathToExecute) {
        var data = '';
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
          if (data === '') {
            data = nodesSnapshot.snapshotItem(i).textContent;
          } else {
            data = data + ',' + nodesSnapshot.snapshotItem(i).textContent;
          }
        }
        addHiddenDiv('graco_dimensions', data);
      };
      xpathAggregateRating('//span[@class="product-object"]/@data-product');
      xpathDimensions('//ul[@id="collapsible-pdp-details-3"]/li[contains(text(),"Product")]/text()');
    });
    return await context.extract(productDetails);
  },
};
