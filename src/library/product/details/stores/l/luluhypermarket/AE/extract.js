const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'luluhypermarket',
    transform: cleanUp,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
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

      const additionalBulletInfoContent = getAllXpath("//div[@class='description']//ul//li/text()", 'nodeValue');
      if (additionalBulletInfoContent !== null && additionalBulletInfoContent.length > 0) {
        var additionalBulletInfoText = additionalBulletInfoContent.join(' || ');
      }

      const additionalDescription = getAllXpath("//div[contains(@class,'pd-features-section')]//h4/text() | //div[@class='features-ul']//p/text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))] | //div[@class='tab-details']//p/text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      var textValues = [];
      var temp = '';
      if (additionalDescription !== null && additionalDescription.length > 0) {
        additionalDescription.forEach(function (item, index) {
          temp = item.trim();
          textValues.push(temp);
        });
        var additionalDescriptionContent = textValues.join(' ');
      }
      var descriptionContent = additionalBulletInfoText + ' | ' + additionalDescriptionContent;
      addElementToDocument('addedDescriptionContent', descriptionContent);

      const customerRatingNode = getXpath("//ul[contains(@class,'reviews-list')]//li//div[contains(@class,'rating-stars')]/@data-rating", 'nodeValue');
      var customerRatingObject = JSON.parse(customerRatingNode);
      if (customerRatingObject.rating !== '') {
        var ratingValue = parseFloat(customerRatingObject.rating).toFixed(1);
      } else {
        // @ts-ignore
        ratingValue = 0;
      }
      addElementToDocument('addedCustomerRating', ratingValue);

      const heightNode = getAllXpath("//div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Height')] | //div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Height')]//following::p[1]/text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      if (heightNode !== null && heightNode.length > 0) {
        var heightValue = heightNode.join(' : ');
      }

      const widthNode = getAllXpath("//div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Width')] | //div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Width')]//following::p[1]/text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      if (widthNode !== null && widthNode.length > 0) {
        var widthValue = widthNode.join(' : ');
      }

      const depthNode = getAllXpath("//div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Depth')] | //div[contains(@class,'pd-features-section')]//div[@class='features-ul']//p[1]/text()[contains(.,'Depth')]//following::p[1]/text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      if (depthNode !== null && depthNode.length > 0) {
        var depthValue = depthNode.join(' : ');
      }

      const shippingDimension = ((heightValue !== undefined) ? (heightValue + ' || ') : '') + ((widthValue !== undefined) ? (widthValue + ' || ') : '') + ((depthValue !== undefined) ? depthValue : '');
      addElementToDocument('addedShippingDimension', shippingDimension);

      var onlinePrice = getXpath("//section[@class='product-details-page-main']//div[@class='prod-price']//ul//li//span[not(@class='product-discount-badge')]/text()", 'nodeValue');
      onlinePrice = 'AED ' + onlinePrice;
      addElementToDocument('addedonlinePrice', onlinePrice);

      const specificationsList = getAllXpath("//div[contains(@class,'inpage_selector_specification')]//table[1]//tbody//tr//th/text() | //div[contains(@class,'inpage_selector_specification')]//table[1]//tbody//tr//td/text()| //div[contains(@class,'inpage_selector_specification')]//div[@class='flix-tech-spacs-contents']//ul//li//div[@class='flix-dt']/text() | //div[contains(@class,'inpage_selector_specification')]//div[@class='flix-tech-spacs-contents']//ul//li//div[@class='flix-dd']/text() | //div[contains(@class,'inpage_selector_specification')]//div[@class='flix_mainspecs']//div[@class='flix-border-specs-right']//text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      if (specificationsList !== null && specificationsList.length > 0) {
        var specValue = specificationsList.join(' || ');
        addElementToDocument('addedSpecification', specValue);
      }

      const enhancedContent = getAllXpath("//div[@id='inpage_container']//text()[normalize-space(.) and normalize-space(translate(/,'&#10;', '')) and normalize-space(translate(/,'&#09;', ''))]", 'nodeValue');
      if (enhancedContent !== null && enhancedContent.length > 0) {
        var contentValue = enhancedContent.join('');
        addElementToDocument('enhancedContent', contentValue);
      }

      const videoLinkNodesOne = getAllXpath("//*[contains(@class,'fullJwPlayerWarp')]//input/@value", 'nodeValue');
      var videoOneObjects = [];
      var videoOneContent = [];
      if (videoLinkNodesOne != null) {
        videoLinkNodesOne.forEach(function (element, index) {
          videoOneObjects.push(JSON.parse(element));
        });
        videoOneObjects.forEach(function (element, index) {
          var temp = 'https:' + element.playlist[0].file;
          videoOneContent.push(temp);
        });
      }
      addElementToDocument('addedVideos', videoOneContent.join(' || '));
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
