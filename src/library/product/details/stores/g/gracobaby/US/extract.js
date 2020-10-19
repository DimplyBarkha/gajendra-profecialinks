
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
