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
      const featureDescInfo = getAllXpath(featureDescInfoXpath, 'nodeValue').join(' ||');
      const tabDescInfoXpath = "//div[@class='product-info-description']/text()";
      const tabDescInfo = getAllXpath(tabDescInfoXpath, 'nodeValue');
      const bulletsXpath = "//div[@class='product-info-description']/ul/li/text()";
      const bulletsInfo = getAllXpath(bulletsXpath, 'nodeValue').join(' ||');
      const modelXpath = "//div[contains(@class,'item-model-number')]//span/@data-model-number";
      let modelInfo = getXpath(modelXpath, 'nodeValue');
      const boldText = getAllXpath('//div[@class="product-info-description"]//span[1]/text()', 'nodeValue');

      if (modelInfo === null) {
        const modelXpath1 = "//div[@class='product-info-description']/span[2]";
        modelInfo = getXpath(modelXpath1, 'innerText');
        if (modelInfo !== null) {
          modelInfo = modelInfo.replace('Model: ', '');
        }
      }
      const tabDescInfoNew = [];
      // let model;
      let flag = false;
      if (tabDescInfo.length > 0) {
        tabDescInfo.forEach(function (element) {
          if (element.includes('Model')) {
            flag = true;
            modelInfo = element.replace('Model: ', '');
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
      }

      let finalDescInfo;

      if (featureDescInfo !== null && featureDescInfo.length > 0) {
        addElementToDocument('featureBullets', featureDescInfo);
        finalDescInfo = 'Features: ||' + featureDescInfo + ' ||' + boldText[0] + ' ||' + tabDescInfo[1];
      }
      if (bulletsInfo !== null && bulletsInfo.length > 0) {
        addElementToDocument('additionalDescBulletInfo', bulletsInfo);
        finalDescInfo = finalDescInfo + bulletsInfo;
      }

      if (boldText.length > 0 && boldText[2] !== null) {
        if (!boldText[2].includes('★')) {
          finalDescInfo = finalDescInfo + ' ||' + boldText[2];
        }
      }
      tabDescInfo[2] = tabDescInfo[2].trim();
      if (tabDescInfo[2].length > 0) {
        finalDescInfo = finalDescInfo + ' ||' + tabDescInfo[2];
      }

      if (finalDescInfo !== null && finalDescInfo.length > 0) {
        finalDescInfo = finalDescInfo.replace('\n', ' ');
        addElementToDocument('added_descriptionText', finalDescInfo);
      }

      // xpath for sku
      const skuValue = getXpath('//div[@class="row"]//div[contains(@class,"item-model-number")]//span/@data-model-number', 'nodeValue');
      if (skuValue !== null) {
        addElementToDocument('skuValue', skuValue);
      } else {
        addElementToDocument('skuValue', modelInfo);
      }
      // xpath for variantId
      let variantId = getXpath('//p[contains(@id,"product-body-item-number")]//span/@data-sku | //p[contains(@id,"product-body-item-number")]/text()', 'nodeValue');
      if (variantId !== null) {
        variantId = variantId.replace('Item', '');
        addElementToDocument('variantId', variantId);
      }

      // xpath for video
      const videoUrlPath = getXpath("//div[contains(@class,'fullJwPlayerWarp')]//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addElementToDocument('added_video_url', videoUrlObj.playlist[0].file);
      }

      const specXpath = '//div[contains(@class,"product-info-specs")]//div[@class="row"]';
      const specValue = getAllXpath(specXpath, 'innerText');
      let specVal = '';
      specValue.forEach(function (element) {
        specVal = specVal + ' ' + element;
      });
      if (specVal.length > 0) {
        addElementToDocument('added_specValue', specVal);
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

      // xpath for availabilityText
      const altAvailXpath = '//script[@type="text/javascript"][contains(text(),"Viewed Product")]';
      const altAvailValue = getXpath(altAvailXpath, 'innerText');
      const idObj = JSON.stringify(altAvailValue);
      var idArr = idObj.split(',');
      let availabilityText;

      if (idArr[10].includes('In stock')) {
        availabilityText = 'In Stock';
      } else if (idArr[9].includes('Out of stock')) {
        availabilityText = 'Out of Stock';
      }
      addElementToDocument('availabilityText', availabilityText);

      // xpath for priceValue
      let priceValue;
      let priceNew;
      if (idArr[6].includes('price:')) {
        // priceNew = idArr[6].substring(18, 23);
        priceNew = idArr[6].substring(idArr[6].indexOf("'") + 1, idArr[6].lastIndexOf("'"));

        priceValue = '$' + '' + priceNew;
      } else if (idArr[5].includes('price:')) {
        priceNew = idArr[5].substring(idArr[5].indexOf("'") + 1, idArr[5].lastIndexOf("'"));

        priceValue = '$' + '' + priceNew;
      }
      addElementToDocument('priceValue', priceValue);

      addElementToDocument('added_variantCount', 0);

      const aggregateRating = getXpath("//span[@itemprop='ratingValue']", 'innerText');
      if (aggregateRating) {
        addElementToDocument('added_aggregateRating', aggregateRating.replace('.', ','));
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
