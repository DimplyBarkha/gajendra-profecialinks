const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'olsale',
    transform: cleanUp,
    domain: 'olsale.co.il',
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
      const retainAlphaNumbericString = (inputString) => {
        return inputString.replace(/[^a-zA-Z0-9.*]/g, '');
      };

      const availabilityStatusUrl = getXpath("//link[@itemprop='availability']/@href", 'nodeValue');
      var availabilityStatusValue;
      if (availabilityStatusUrl != null) {
        if (availabilityStatusUrl.indexOf('InStock')) {
          availabilityStatusValue = 'In stock';
        } else {
          availabilityStatusValue = 'Out of Stock';
        }
      } else {
        availabilityStatusValue = '';
      }
      addElementToDocument('added_availabilityText', availabilityStatusValue);

      const skuText = getXpath("//meta[@itemprop='sku']/@content | //img[@itemprop='image']/@data-sku", 'nodeValue');
      addElementToDocument('added_sku', retainAlphaNumbericString(skuText));

      const specificationText = getAllXpath("//span[@id='ProductText']//div/text()[preceding-sibling::br and contains(.,'מידות:')] | //span[@id='ProductText']//div/text()[preceding-sibling::br and contains(.,'מידות:')]//following-sibling::text() | //span[@id='ProductText']//div//span//strong/text()[contains(.,'מידות')]//..//..//..//following-sibling::div/text() | //span[@id='ProductText']//div/text()[contains(.,'מפרט טכני')]//../following-sibling::div//text() | //div[@class='c']//div[@class='spec-set__item']//text() | //div[@class='spec-set__image-set']//div[@class='spec-set__item']//text() | //span[@id='ProductText']//p/text()[contains(.,'מידות')]//following::p[position() < 7]/text() | //span[@id='ProductText']//p/text()[contains(.,'מידות')]//following::p[position() < 7]//strong/text()", 'nodeValue');
      var specification = specificationText.join(' || ');

      addElementToDocument('addedSpecification', specification);

      const shippingWeight = getXpath("//span[@id='ProductText']//div/text()[preceding-sibling::br and contains(.,'משקל')] | //span[@id='ProductText']//div/text()[contains(., 'משקל')] | //span[@id='ProductText']//div[contains(text(), 'משקל')] | //span[@id='ProductText']//p/text()[preceding-sibling::br and contains(.,'משקל')] | //span[@id='ProductText']//p[contains(text(), 'משקל')]", 'nodeValue');

      // const weight = shippingWeight ? shippingWeight : '';
      const weight = shippingWeight;

      console.log('shippingweight' + shippingWeight);

      if (weight != null) {
        var finalWeight = retainAlphaNumbericString(weight);
        if (finalWeight.includes('.')) {
          if (finalWeight.includes('KG') || finalWeight.includes('kg')) {
          // finalWeight = finalWeight;
          } else {
            finalWeight = finalWeight + 'KG';
          }
        } else {
          finalWeight = finalWeight + 'GM';
        }
      } else { finalWeight = ''; }

      addElementToDocument('added_shipping_weight', finalWeight);

      const listPriceNode = getXpath("//div[(contains(@class,'panel-body'))]//div[(contains(@class,'row'))]//div[(contains(@class,'col-sm-7'))]//div[@class='centerText']//span//strike/text()", 'nodeValue');
      console.log('listPriceNode : ' + listPriceNode);
      const listPrice = listPriceNode ? '₪ ' + retainAlphaNumbericString(listPriceNode) : '';
      addElementToDocument('added_list_price', listPrice);

      const manufactureDescriptionNode = getXpath("//div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div/text()[following-sibling::br] | //div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//../text()", 'nodeValue');
      console.log('manufactureDescriptionNode : ' + manufactureDescriptionNode);
      addElementToDocument('added_manufacturerDescription', manufactureDescriptionNode);

      const onlinePriceNode = getXpath("//div[(contains(@class,'bigContent'))]//div[(contains(@class,'pricetxtdesktop'))]//span[@class='price']/text()", 'nodeValue');

      console.log('onlinePriceNode :' + onlinePriceNode);
      const onlinePrice = onlinePriceNode ? '₪ ' + onlinePriceNode : '';
      addElementToDocument('added_online_price', onlinePrice);

      // Get All Value Xpath Extraction used

      const addtionalContentBullets = getAllXpath("//div[contains(@class,'col-sm-7')]//ul//li/text()", 'nodeValue');
      var finalBulletText = addtionalContentBullets.join('|| ');

      addElementToDocument('addedAdditionalBulletsInfo', finalBulletText);

      const productAdditionalContentText = getAllXpath("//div[@id='divAdditionalDataTabHeader']//div//text()", 'nodeValue');

      addElementToDocument('added_description', productAdditionalContentText);

      const getSecondaryImagesList = getAllXpath("//div[@id='galleryApp']//div[(contains(@class,'galleryItem'))]//img/@src", 'nodeValue');
      for (let i = 1; i < getSecondaryImagesList.length; i++) {
        getSecondaryImagesList[i] = getSecondaryImagesList[i].replace('icon', 'gallery');
        console.log('getSecondaryImagesLis :' + i + getSecondaryImagesList[i]);
      }
      getSecondaryImagesList.shift();
      addElementToDocument('added_secondary_Image', getSecondaryImagesList);

      const enhancedConetent = getAllXpath("//div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//..//following-sibling::div//strong/text() | //div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//..//following-sibling::div/text() | //div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//..//following-sibling::div//p/text() | //div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//..//following-sibling::div//ul//li//div//span//strong/text() | //div[@id='divAdditionalDataTabHeader']//span[@id='ProductText']//div//img//..//following-sibling::div//ul//li//div//span//em//span/text()", 'nodeValue');
      addElementToDocument('addedEnhancedContent', enhancedConetent);

      addElementToDocument('added_variantCount', 0);

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
