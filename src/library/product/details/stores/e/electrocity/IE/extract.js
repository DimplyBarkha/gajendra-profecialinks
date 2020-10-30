const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'electrocity',
    transform: cleanUp,
    domain: 'electrocity.ie',
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

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
      const productName = getXpath("//h1[contains(@class, 'product_title')]/text()", 'nodeValue');
      if (productName && typeof productName === 'string') {
        const mpc = productName ? productName.split('| ') : [];
        addElementToDocument('added_mpc', mpc[1]);
      }

      const image = getXpath("(//div[@class='slick-list draggable']//div[contains(@class,'slick-active')]//div[@class='jet-woo-product-gallery__image ']//a[@class='jet-woo-product-gallery__image-link']/@href)[1]", 'nodeValue');

      const alternateImageXpath = "//div[@class='slick-track']//div[contains(@class,'slick-slide')]//div[@class='jet-woo-product-gallery__image ']//a[@class='jet-woo-product-gallery__image-link']/@href";
      const alternateImageStr = getAllXpath(alternateImageXpath, 'nodeValue').join(',');
      if (alternateImageStr && typeof alternateImageStr === 'string') {
        const alternateImageList = alternateImageStr.split(',');
        var uniqueAlternateImageList = alternateImageList.filter(function (item, pos) {
          return alternateImageList.indexOf(item) === pos;
        });
        uniqueAlternateImageList.forEach(function (imageUrlData) {
          if (image !== imageUrlData) {
            addElementToDocument('added_alternate_image', (imageUrlData));
          }
        });
      }

      const shippingDimensions = getXpath("//tr[@class='attribute-key-Dimensions']/td/p", 'innerText');
      if (shippingDimensions && typeof shippingDimensions === 'string') {
        addElementToDocument('added_shipping_dimensions', (shippingDimensions.split('Weight'))[0]);
      }

      const otherDescriptionXpath = "//div[@class='elementor-widget-wrap']//div[contains(@class, 'elementor-element')]//table[@class='shop_attributes']/tbody/tr[position()>1]";
      const otherDescriptionStr = getAllXpath(otherDescriptionXpath, 'innerText').join(' | ');
      addElementToDocument('added_productOtherInformation', otherDescriptionStr);

      const specificationsXpath = "//table[@class='flix-std-specs-table']/tbody/tr/td";
      var specificationsStr = getAllXpath(specificationsXpath, 'innerText').join(' || ');

      const specificationsPart = getXpath("//div[@id='flix-inpage']//div[@id='inpage_container']//iframe", 'innerText');
      if (specificationsPart) {
        specificationsStr = specificationsStr.concat(' || ').concat(specificationsPart);
      }
      addElementToDocument('added_specifications', specificationsStr);

      const ratingCount = getXpath("//span[@class='yotpo-sum-reviews']//span[contains(concat(' ', normalize-space(@class), ' '), ' font-color-gray')]/text()", 'nodeValue');
      const addedRatingCount = ratingCount ? ratingCount.split(' Review') : [];
      if (addedRatingCount[0] > 0) {
        addElementToDocument('added_ratingCount', addedRatingCount[0]);
      }

      const technicalInformationPdfUrl = getXpath("//div[contains(@class, 'elementor-element-dfd5028')]//span[contains(@class, 'elementor-heading-title')]//a/@href", 'nodeValue');
      var technicalInformationPresent = 'No';
      if (technicalInformationPdfUrl && technicalInformationPdfUrl !== '') {
        technicalInformationPresent = 'Yes';
      }
      addElementToDocument('added_technicalInformationPresent', technicalInformationPresent);

      const manufacturerDescriptionXpath = "//div[@class='flix-Text-block']";
      var manufacturerDescription = getAllXpath(manufacturerDescriptionXpath, 'innerText');
      const manufacturerDescriptionPart = getAllXpath("//div[contains(@class,'flix-std-featureslist')]//div[contains(@class,'flix-std-clmn-lg-4 flix-std-clmn-sm-6')]", 'innerText').join(',');
      if (manufacturerDescriptionPart) {
        manufacturerDescription = manufacturerDescription.concat(manufacturerDescriptionPart);
      }
      const manufacturerDescriptionPart2 = getAllXpath("(//div[@id='tab-description']/h2) | (//div[@id='tab-description']/h4) |(//div[@id='tab-description']/p)", 'innerText').join(',');
      if (manufacturerDescriptionPart2) {
        manufacturerDescription = manufacturerDescription.concat(manufacturerDescriptionPart2);
      }
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);

      const aggregateRatingTxt = getXpath('//span[@class="sr-only"]/text()', 'nodeValue');

      if (aggregateRatingTxt && typeof aggregateRatingTxt === 'string') {
        const aggregateRating = aggregateRatingTxt ? aggregateRatingTxt.split(' ') : [];
        if (aggregateRating[0] !== '0.0') {
          addElementToDocument('added_aggregateRating', aggregateRating[0]);
        }
      }

      addElementToDocument('added_variantCount', 0);

      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addElementToDocument('added_video_url', videoUrlObj.playlist[0].file);
      }

      const promotionStr = getXpath("(//div[@class='elementor-widget-wrap']//div[contains(@class, 'elementor-clearfix')]/p)[1]", 'innerText');
      if (promotionStr && typeof promotionStr === 'string' && promotionStr.includes('SAVE')) {
        addElementToDocument('added_promotion', promotionStr);
      }

      var weightNetStr = getXpath("//table[@class='flix-std-specs-table']", 'innerText');

      if (weightNetStr) {
        weightNetStr = weightNetStr.toLowerCase();
        if (weightNetStr.includes('weight') && weightNetStr.includes('kg')) {
          const weightNet = weightNetStr.substring(weightNetStr.lastIndexOf('weight') + 7, weightNetStr.lastIndexOf('kg') + 2);
          addElementToDocument('added_weight', weightNet);
        }
      } else {
        weightNetStr = getXpath("//tr[@class='attribute-key-Dimensions']", 'innerText');
        if (weightNetStr) {
          weightNetStr = weightNetStr.toLowerCase();
          if (weightNetStr.includes('weight') && weightNetStr.includes('kg')) {
            const weightNet = weightNetStr.substring(weightNetStr.lastIndexOf('weight') + 7, weightNetStr.lastIndexOf('kg') + 2);
            addElementToDocument('added_weight', weightNet);
          }
        }
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
