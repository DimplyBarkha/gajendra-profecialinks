
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

      // Comma Concatenation
      const commaSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' , ');
        addHiddenDiv(id, doubleSeparatorText);
      };
      // > Concatenation
      const angelSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' > ');
        addHiddenDiv(id, doubleSeparatorText);
      };
      // - Concatenation
      const hiphenSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' - ');
        addHiddenDiv(id, doubleSeparatorText);
      };

      const addDescBulletInfo = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()|//ul[@id='collapsible-pdp-details-4']/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      const addvariantInfo = getAllXpath("//div[contains(@class,'color-attribute')]/span[contains(@class,'js-nonretail')]/@data-attr-value", 'nodeValue');
      commaSeparatorDouble('addvariantInfo', addvariantInfo);

      const adddescriptionInfo = getAllXpath("//div[@id='collapsible-pdp-details-1']/text() | //ul[@id='collapsible-pdp-details-2']/li/text()", 'nodeValue');
      commaSeparatorDouble('adddescriptionInfo', adddescriptionInfo);

      const addwarningInfo = getAllXpath("//ul[@id='collapsible-pdp-details-4']/li/text()", 'nodeValue');
      commaSeparatorDouble('addwarningInfo', addwarningInfo);

      const addManufacturerDescInfo = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()", 'nodeValue');
      commaSeparatorDouble('addManufacturerDescInfo', addManufacturerDescInfo);

      const addSubCategoryInfo = getAllXpath("//ol[@class='breadcrumb']/li[3]/a/text() | //ol[@class='breadcrumb']/li[4]/a/text()", 'nodeValue');
      angelSeparatorDouble('addSubCategoryInfo', addSubCategoryInfo);

      const addProductDescInfo = getAllXpath("//div[@class='d-md-none col-sm-12']/h5/text()|//span[@class='color-display-value order-3 ml-1']/text()", 'nodeValue');
      hiphenSeparatorDouble('addProductDescInfo', addProductDescInfo);

      const addDirectionInfo = getAllXpath("//div[@id='collapsible-pdp-details-6']/span/text()", 'nodeValue');
      pipeSeparatorDouble('addDirectionInfo', addDirectionInfo);

      const addvideo1Info = getAllXpath("//div[contains(@class,'pdp-thumb-img d-flex')]/@data-video-server-url", 'nodeValue');
      const addvideo2Info = getAllXpath("//div[contains(@class,'pdp-thumb-img d-flex')]/@data-asset", 'nodeValue');
      addHiddenDiv('addvideoInfo', addvideo1Info[0] + addvideo2Info[0]);

      // Java Script Code to retrieve Xpath for availability
      var xpathavailability = function (xpathToExecute) {
        var data = '';
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        data = nodesSnapshot.snapshotItem(0).textContent;
        data = data.substring(data.indexOf('dimension51":') + 14);
        data = data.substring(0, data.indexOf(',') - 1);
        addHiddenDiv('graco_availability', data);
      };
      const addavailabilityInfo = getAllXpath("//ul[@id='collapsible-pdp-details-3']/li[contains(text(),'Product')]/text()", 'nodeValue');
      pipeSeparatorDouble('graco_dimensions', addavailabilityInfo);
      xpathavailability('//span[@class="product-object"]/@data-product');
    });
    return await context.extract(productDetails);
  },
};
