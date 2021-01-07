const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    transform: cleanUp,
    domain: 'gracobaby.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Java Script Code for adding new Div
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class='container product-detail product-wrapper user-selected']")[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        // document.body.appendChild(newDiv);
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
        var doubleSeparatorText = data.join(',');
        addHiddenDiv(id, doubleSeparatorText);
      };
      // Space Concatenation
      const spaceSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' ');
        addHiddenDiv(id, doubleSeparatorText);
      };
      try {
        const addDescBulletInfo = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()|//ul[@id='collapsible-pdp-details-4']/li/text()", 'nodeValue');
        pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
      } catch (error) {

      }
      try {
        const addvariantInfo = getAllXpath("//div[contains(@class,'color-attribute')]/span[contains(@class,'js-nonretail')]/@data-attr-value", 'nodeValue');
        commaSeparatorDouble('addvariantInfo', addvariantInfo);
      } catch (error) {

      }
      var descFinal = [];
      const pushFunction = function (data) {
        for (let i = 0; i < data.length; i++) {
          descFinal.push(data[i]);
        }
      }

      try {
        const mainDesc = getAllXpath("//div[@id='collapsible-pdp-details-1']/text()", 'nodeValue');
        pushFunction(mainDesc);
      } catch (error) {

      }

      for (let i = 0; i < descFinal.length; i++) {
        console.log(descFinal[i]);
      }
      try {
        const upperDesc = getAllXpath("//div[@class='details']//li/text()", 'nodeValue');
        pushFunction(upperDesc);
      } catch (error) {

      }
      try {
        const belowLI = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()", 'nodeValue');
        pushFunction(belowLI);
      } catch (error) {

      }
      commaSeparatorDouble('adddescriptionInfo', descFinal)
      try {
        const addwarningInfo = getAllXpath("//ul[@id='collapsible-pdp-details-4']/li/text()", 'nodeValue');
        commaSeparatorDouble('addwarningInfo', addwarningInfo);
      } catch (error) {

      }
      try {
        const addManufacturerDescInfo = getAllXpath("//ul[@id='collapsible-pdp-details-2']/li/text()", 'nodeValue');
        commaSeparatorDouble('addManufacturerDescInfo', addManufacturerDescInfo);
      } catch (error) {

      }
      try {
        const addProductDescInfo = getAllXpath("//div[@class='d-md-none col-sm-12']/h5/text()|//div[@role='radio' and contains(@class,'color-attribute')]/span[contains(@class,'selected')]/@data-attr-value", 'nodeValue');
        addProductDescInfo.splice(0, 0, 'Graco');
        spaceSeparatorDouble('addProductDescInfo', addProductDescInfo);
      } catch (error) {

      }
      try {
        const addDirectionInfo = getAllXpath("//div[@id='collapsible-pdp-details-6']/span/text()", 'nodeValue');
        pipeSeparatorDouble('addDirectionInfo', addDirectionInfo);
      } catch (error) {

      }
      try {
        const addvideo1Info = getAllXpath("//div[contains(@class,'pdp-thumb-img d-flex')]/@data-video-server-url", 'nodeValue');
        const addvideo2Info = getAllXpath("//div[contains(@class,'pdp-thumb-img d-flex')]/@data-asset", 'nodeValue');
        addHiddenDiv('addvideoInfo', addvideo1Info[0] + addvideo2Info[0]);
      } catch (error) {

      }
      try {
        let finalspecifications = '';
        const specifications = getAllXpath("//h5[@class='title d-none d-lg-block' and contains(text(),'Specifications')]/following-sibling::ul/li/text()", 'nodeValue');
        for (let i = 0; i < specifications.length; i++) {
          if (specifications[i].includes('Color')) {
            finalspecifications = finalspecifications + specifications[i];
          }
          if (specifications[i].includes('Model')) {
            finalspecifications = finalspecifications + specifications[i];
          }
        }
        addHiddenDiv('finalspecifications', finalspecifications);
      } catch (error) {

      }
      try {
        const sku = getAllXpath('//script[@type="application/ld+json" and contains(text(),"sku")]/text()', 'nodeValue');
        const finalSKU = JSON.parse(sku[0]);
        addHiddenDiv('sku', finalSKU.sku.replace('SAP_', ''));
      } catch (error) {

      }
      try {
        const availability = getAllXpath('//script[@type="application/ld+json" and contains(text(),"InStock")]/text()', 'nodeValue');
        if (availability.length > 0) {
          addHiddenDiv('graco_availability', 'graco_availability');
        }
      } catch (error) {

      }
      try {
        const price = getAllXpath('//script[@type="application/ld+json" and contains(text(),"availability")]/text()', 'nodeValue');
        let finalprice = JSON.parse(price[0]);
        addHiddenDiv('price', '$' + finalprice.offers.price);
      } catch (error) {

      }
    });
    return await context.extract(productDetails);
  },
};
