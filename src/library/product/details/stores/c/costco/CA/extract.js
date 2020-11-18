const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform: cleanUp,
    domain: 'costco.ca',
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

      /*
      const retainAlphaNumbericString = (inputString) => {
        return inputString.replace(/[^a-zA-Z0-9]/g, '');
      }; */

      // Get Single Value XPATH Extraction

      // xpath for description
      const featureDescInfoXpath = "//div[@class='features-container form-group']//ul/li/text()";
      const featureDescInfo = getAllXpath(featureDescInfoXpath, 'nodeValue').join(' || ');
      const tabDescInfoXpath = "//div[@class='product-info-description']/text()";
      const tabDescInfo = getAllXpath(tabDescInfoXpath, 'nodeValue');
      const bulletsXpath = "//div[@class='product-info-description']/ul/li/text()";
      const bulletsInfo = getAllXpath(bulletsXpath, 'nodeValue').join(' || ');
      const modelXpath = "//div[contains(@class,'item-model-number')]//span/@data-model-number";
      const modelInfo = getXpath(modelXpath, 'nodeValue');
      const tabDescInfoNew = [];
      let model;
      let flag = false;
      tabDescInfo.forEach(function (element) {
        if (element.includes('Model')) {
          flag = true;
          model = element.replace('Model: ', '');
        }
        let info = element.replace('\n', '');
        info = info.replace('\t', '');
        info = info.trim();
        if (info.length > 0) {
          tabDescInfoNew.push(info);
        }
      });
      if (!flag) {
        tabDescInfoNew.push('Model: ' + modelInfo);
      }

      let finalDescInfo;
      if (featureDescInfo.length > 0) {
        addElementToDocument('featureBullets', featureDescInfo);
        finalDescInfo = 'Features: || ' + featureDescInfo + ' || ' + tabDescInfoNew.join('||');
      }
      if (bulletsInfo.length > 0) {
        addElementToDocument('additionalDescBulletInfo', bulletsInfo);
        finalDescInfo = finalDescInfo + ' || ' + bulletsInfo;
      }
      finalDescInfo = finalDescInfo.replace('\n', '||');
      addElementToDocument('added_descriptionText', finalDescInfo);

      // xpath for sku
      const skuValue = getXpath('//div[@class="row"]//div[contains(@class,"item-model-number")]//span/@data-model-number', 'nodeValue');
      if (skuValue !== null) {
        addElementToDocument('skuValue', skuValue);
      } else {
        addElementToDocument('skuValue', model);
      }

      // xpath for video
      let videoURL = getXpath('//div[@class="flix-videodiv inpage_selector_video"]//iframe/@src', 'nodeValue');
      if (videoURL !== null) {
        addElementToDocument('videoURL', videoURL);
      } else {
        videoURL = getXpath('//div[@id="html5videostage"]//video/@src', 'nodeValue');
        addElementToDocument('videoURL', videoURL);
      }

      // xpath for specificationValue
      const specifictionXpath = '//div[@class="product-info-description"]/ul[3]';
      const specificationValue = getAllXpath(specifictionXpath, 'innerText');
      specificationValue.forEach(function (element) {
        const specArray = element.split('\n');
        var i;
        for (i = 0; i < specArray.length; i++) {
          if (specArray[i].includes('Weight')) {
            const weight = specArray[i].replace('Weight:', '');
            addElementToDocument('weightValue', weight);
          }
          if (specArray[i].includes('in') || specArray[i].includes('cm')) {
            const dimensions = specArray[i].replace('Dimensions (L × W × H): ', '');
            addElementToDocument('dimensionValue', dimensions);
          }
        }
      });

      // xpath for colorValue
      const colorXpath = '//div[@class="product-info-description"]//ul//li[position()=1]';
      let colorValue = getXpath(colorXpath, 'innerText');
      if (colorValue !== null && colorValue.length > 0 && colorValue.includes('Colour')) {
        colorValue = colorValue.replace('Colour:', '');
        addElementToDocument('colorValue', colorValue);
      }

      // xpath for priceValue
      const priceXpath = '//div[contains(@id,"pull-right-price")]/span';
      const priceValue = getAllXpath(priceXpath, 'innerText');
      let priceNew;
      if (priceValue.length > 0 && !priceValue[0].includes('- -.- -')) {
        priceNew = [priceValue[1] + '' + priceValue[0]];
        addElementToDocument('priceValue', priceNew);
      }

      // xpath for availabilityText
      const availXpath = '//meta[@property="og:availability"]/@content';
      const availValue = getXpath(availXpath, 'nodeValue');
      let availabilityText;
      if (availValue != null) {
        if (availValue.includes('instock')) {
          availabilityText = 'In Stock';
        } else {
          availabilityText = 'Out of Stock';
        }
        addElementToDocument('availabilityText', availabilityText);
      }

      const aggregateRating = getXpath("//span[@itemprop='ratingValue']", 'innerText');
      if (aggregateRating) {
        addElementToDocument('added_aggregateRating', aggregateRating.replace('.', ','));
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
