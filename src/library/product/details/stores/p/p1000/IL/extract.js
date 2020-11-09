
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'p1000',
    transform: cleanUp,
    domain: 'p1000.co.il',
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

      // Get Single Value XPATH Extraction

      // xpath for variantCount
      addElementToDocument('added_variantCount', 0);

      // xpath for availabilityText
      const availabilityStatusUrl = getXpath("//meta[@itemprop='availability']/@content", 'nodeValue');
      var availabilityStatusValue;
      if (availabilityStatusUrl.includes('InStock')) {
        availabilityStatusValue = 'In stock';
      }
      if (availabilityStatusUrl.includes('OutOfStock')) {
        availabilityStatusValue = 'Out of Stock';
      }
      addElementToDocument('added_availabilityText', availabilityStatusValue);

      // xpath for Description
      const descriptionInfoXpath = "//meta[@id='head_description']/@content";
      const descriptionInfo = getXpath(descriptionInfoXpath, 'nodeValue');
      const tabDescriptionInfoXpath = "//li[contains(@id,'MainContent_Properties_productDetails')]/text()";
      const tabDescriptionInfo = getAllXpath(tabDescriptionInfoXpath, 'nodeValue');
      const bulletPointsXpath = "//ul[@class='productFrame_chkList']//li";
      const bulletPointInfo = getAllXpath(bulletPointsXpath, 'innerText');
      let finalDescriptionInfo;
      if (tabDescriptionInfo !== null && tabDescriptionInfo.length > 0) {
        addElementToDocument('added_bulletInfo', bulletPointInfo.join(' || '));
        finalDescriptionInfo = descriptionInfo + ' || ' + bulletPointInfo + ' || ' + tabDescriptionInfo.join(' || ');
        addElementToDocument('added_descriptionText', finalDescriptionInfo);
      }

      // xpath weightNet for weightNet
      const weightNet = getAllXpath("//li[contains(@id,'MainContent_Properties_pFreeText')]", 'innerText');
      weightNet.forEach(function (data) {
        if (data.includes('משקל כולל') || data.includes('משקל')) {
          const indx = data.indexOf('משקל כולל') > 0 ? data.indexOf('משקל כולל') : data.indexOf('משקל');
          let weightStr = data.substring(indx, data.indexOf('\n', data.indexOf('משקל כולל:')));
          weightStr = weightStr.replace('משקל כולל', '');
          weightStr = weightStr.replace('משקל', '');
          weightStr = weightStr.replace(':', '');
          addElementToDocument('added_weightNet', weightStr);
        }

        if (data.includes('צבע')) {
          const colorStr = data.substring(data.indexOf('צבע'), data.indexOf('\n', data.indexOf('צבע')));
          let colorValue;
          colorValue = colorStr.replace('צבע', '');
          colorValue = colorValue.replace(':', '');
          addElementToDocument('added_color', colorValue);
        }

        const specification1 = data.split('\n').join(' || ');
        const spec1 = getXpath("//div[contains(@class,'product_techInfo product_generalInfo_column')]", 'innerText');
        const specification2 = spec1.split('\n').join(' || ');
        let finalSpecification;
        if (specification2 != null && specification2.length > 0) {
          finalSpecification = specification1 + '||' + specification2;
        } else {
          finalSpecification = specification1;
        }
        addElementToDocument('added_specificationText', finalSpecification);
      });

      // xpath for price
      const priceValue = getXpath("//div[contains(@class,'productFrame_price')]//strong/@data-groupprice", 'nodeValue');
      const currencyValue = getXpath("//div[contains(@class,'productFrame_price')]//strong/b", 'innerText');
      let bidpriceValue = getXpath("//div[contains(@class,'productFrame_bid')]//strong", 'innerText');
      const bidCurrencyValue = getXpath("//div[contains(@class,'productFrame_bid')]//strong/b", 'innerText');
      let finalPriceValue;
      if (priceValue != null && currencyValue != null) {
        console.log('My priceValue', priceValue);
        console.log('My currencyValue', currencyValue);
        finalPriceValue = currencyValue + priceValue;
      }
      if (bidpriceValue != null && bidCurrencyValue != null) {
        bidpriceValue = bidpriceValue.replace('₪', '');
        finalPriceValue = bidCurrencyValue + bidpriceValue;
      }
      addElementToDocument('priceValue', finalPriceValue);

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
