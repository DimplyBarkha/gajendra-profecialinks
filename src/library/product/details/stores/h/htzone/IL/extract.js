const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'htzone',
    transform: transform,
    domain: 'htzone.co.il',
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

      const additionalDescBulletInfo = document.querySelectorAll('.innerInfoBox ul li');
      // console.log('additionalDescBulletInfo : ' + additionalDescBulletInfo.length);
      // additionalDescBulletInfo.forEach((item)=> {
      //   console.log(item);
      //   addElementToDocument('added_additionalDescBulletInfo', item.textContent);
      // })
      addElementToDocument('addEelementBullentCount', additionalDescBulletInfo.length);

      const additionalDescBulletInfoNode = getAllXpath('//div[@class="innerInfoBox"]//ul//li/text()');
      var bulletValues = additionalDescBulletInfoNode.join(' || ');
      addElementToDocument('added_additionalDescBulletInfo', bulletValues);

      const additionalDescription = document.querySelectorAll('.right');
      console.log('additionalDescription :' + additionalDescription.length);
      let description = '';
      additionalDescription.forEach((item) => {
        console.log(item);
        if (item.textContent.includes('צבע') || item.textContent.includes('ליטר/שנייה') ||
            item.textContent.includes('הספק מנוע') || item.textContent.includes('כבל חשמל באורך') ||
            item.textContent.includes('משקל') || item.textContent.includes('מידות') ||
            item.textContent.includes('קוטר')) {
          // var additionalDescBullInfo = additionalDescBulletInfo.item.;
          description = description + item.textContent + '||';
          console.log('added_additionalDescription' + description);
        }
      });
      var additionalDesc = additionalDescBulletInfo + ' $$ ' + description;
      addElementToDocument('added_additionalDescription', additionalDesc);

      addElementToDocument('added_productsPerPage', 0);

      const jsonStr = getXpath("//script[@type = 'application/ld+json']/text()", 'nodeValue');
      // let available;
      if (jsonStr) {
        const jsonObj = JSON.parse(jsonStr);

        console.log('jsonObj' + jsonObj.offers.availability);
        addElementToDocument('addedAvailibility', jsonObj.offers.availability);
        console.log('jsonObj' + jsonObj.offers.price);
        addElementToDocument('addedPrice', jsonObj.offers.price);
        // console.log('jsonObj' + jsonObj.offers.priceCurrency);
        // addElementToDocument('addedOnlinePriceCurrency', jsonObj.offers.priceCurrency);
        console.log('jsonObj' + jsonObj.sku);
        addElementToDocument('addedSku', jsonObj.sku);
        console.log('jsonObj' + jsonObj.aggregateRating.reviewCount);
        addElementToDocument('addedReviewCount', jsonObj.aggregateRating.reviewCount);
      }

      const manufacturerImageXpath = getAllXpath("//div[@class='right']/img/@src", 'nodeValue');
      if (manufacturerImageXpath.length > 0) {
        var manufacturerImage = 'https://htzone.co.il' + manufacturerImageXpath;
        // console.log(manufactirerImage);
        addElementToDocument('added_manufacturerImages', manufacturerImage);
      }

      const specificationXpath = getAllXpath("//section[@id='productFullSpec2']//div//strong/text()[contains(.,'מפרט טכני')]//following::text()[position() <15] | //section[@id='productFullSpec2']//div//strong/text()[contains(.,'שנתיים שירות ואחריות בבית הלקוח')]//following::text()[position() <15]", 'nodeValue');
      if (specificationXpath != null || specificationXpath.length > 0) {
        var concatText = specificationXpath.join(' || ');
      }
      addElementToDocument('addedSpecifications', concatText);

      const additionalDescriptionNode = getAllXpath("//section[@id='productFullSpec2']//div/text()", 'nodeValue');
      var additionalDescriptionText = bulletValues + ' || ' + additionalDescriptionNode;
      addElementToDocument('addedAdditionalDescription', additionalDescriptionText);

      const retainAlphaNumbericString = (inputString) => {
        return inputString.replace(/[^a-zA-Z0-9.*]/g, '');
      };

      const weightXpath = getXpath("//section[@id='productFullSpec2']//div//text()[contains(.,'משקל כולל ')] | //section[@id='productFullSpec2']//div//text()[contains(.,'משקל')]", 'nodeValue');
      // var netWeight = weightXpath.replace(/[^a-zA-Z0-9.]/g, '');

      // const weight = shippingWeight ? shippingWeight : '';
      const weight = weightXpath;
      if (weight != null) {
        var finalWeight = retainAlphaNumbericString(weight);
        if (finalWeight.includes('.')) {
          if (finalWeight.includes('KG') || finalWeight.includes('kg')) {
            // finalWeight = finalWeight;
          } else {
            finalWeight = finalWeight + ' KG';
          }
        } else {
          finalWeight = finalWeight + 'GM';
        }
      } else { finalWeight = ''; }
      addElementToDocument('addedNetWeight', finalWeight);

      // addElementToDocument('addedNetWeight', netWeight);

      const categoryXpath = getXpath("//div/a[contains(@class,'breadcrumb joker' ) and contains(@href,'/category/')]//text()", 'nodeValue');
      console.log(categoryXpath);
      if(categoryXpath) {
        const addedCategory = categoryXpath.replace(/[>]+/g, '');
        addElementToDocument('added_category', addedCategory);
      }
      // const priceCurrency = getXpath("//span[@class = 'currency-symbol']//text()", 'nodeValue');
      // const price = getXpath("//input[@id='txtInitialPrice']/@value", 'nodeValue');
      // const totalPrice = priceCurrency + price;
      // addElementToDocument('addedtotalPrice', totalPrice);
      // console.log('totalPrice ' + totalPrice);
      // const elements = document.querySelectorAll('.content ul > li:nth-child(2)');
      // console.log('elements ' + elements.length);

      // elements.forEach((item) => {
      //   console.log('item ' + item.textContent);
      //   // ddElementToDocument('added_additionalDescBulletInfo', item.textContent);
      // });

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
