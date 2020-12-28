const { transform } = require('../../walmartOG/US/transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmartToGo',
    transform: transform,
    domain: 'grocery.walmart.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // console.log('input ID-------');
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
      let data = {};
      const referrer = window.location.href;
      const pid = window.location.pathname.split('/').pop();
      const fetchURL = 'https://www.walmart.com/grocery/v3/api/products/' + pid + '?itemFields=all&storeId=2086&nutritionPrescriptive=true';

      const searchResults = await fetch(fetchURL, {
        // @ts-ignore
        accept: 'application/json, text/plain, */*',
        referrer: referrer,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      });
      if (searchResults && searchResults.status === 404) {
        // console.log('Product Not Found!!!!');
        // return;
      };
      if (searchResults && searchResults.status === 200) {
        // console.log('Product Found!!!!');
        data = await searchResults.json();
        // console.log(data);
        const availableSelector = () => {
          const outOfStock = document.querySelector('div[class^="ProductPage__outOfStock"]');
          if (outOfStock && outOfStock.getAttribute('data-automation-id')) {
            return !(outOfStock.getAttribute('data-automation-id') === 'out-of-stock-label');
          }

          const error = document.querySelector('section[class^="ProductPage__errorContainer"');
          if (error !== null) {
            return false;
          }
          return true;
        };
        addElementToDocument('iio_sku', data.sku);
        const brandText = (data.detailed && data.detailed.brand) ? data.detailed.brand : '';
        addElementToDocument('iio_brandText', brandText);
        const cssListPrice = 'div[class*="ProductPage__priceContainer"] div[data-automation-id*="old-price"]';
        const listPriceDom = (document.querySelector(cssListPrice) && document.querySelector(cssListPrice).textContent) ? document.querySelector(cssListPrice).textContent : '';
        const listPrice = (data.store && data.store.price && data.store.price.previousPrice) ? data.store.price.previousPrice : listPriceDom;
        addElementToDocument('iio_listPrice', listPrice);
        const pricePerUnit = (data.store && data.store.price && data.store.price.unit) ? data.store.price.unit : '';
        const pricePerUnitUOM = (data.store && data.store.price && data.store.price.displayUnitPrice) ? data.store.price.displayUnitPrice.split('/')[data.store.price.displayUnitPrice.split('/').length - 1] : '';
        addElementToDocument('iio_pricePerUnit', pricePerUnit);
        addElementToDocument('iio_pricePerUnitUOM', pricePerUnitUOM);
        const gtin = (data.upc) ? data.upc : '';
        addElementToDocument('iio_upc', gtin);
        const variantId = (data.detailed && data.detailed.productCode) ? data.detailed.productCode : '';
        const varianceList = (data.variantOffers) ? Object.values(data.variantOffers).map(value => value.productId) : [];
        addElementToDocument('iio_variantId', variantId);
        addElementToDocument('iio_variants', varianceList.join(' | '));
        const available = (data.store && data.store.isInStock) ? data.store.isInStock : availableSelector();
        if (data.nutritionFacts !== undefined) {
          const tfat = (data.nutritionFacts.key_nutrients.children[0].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[0].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_totalFat', tfat);
          const tfatPer = (data.nutritionFacts.key_nutrients.children[0].children[0].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[0].children[0].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_saturatedFat', tfatPer);
          const sodium = (data.nutritionFacts.key_nutrients.children[2].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[2].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_sodium', sodium);
          const transFat = (data.nutritionFacts.key_nutrients.children[0].children[1].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[0].children[1].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_transFat', transFat);
          const colst = (data.nutritionFacts.key_nutrients.children[1].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[1].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_cholesterol', colst);
          const tcarb = (data.nutritionFacts.key_nutrients.children[3].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[3].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_totalCarbs', tcarb);
          const nfiber = (data.nutritionFacts.key_nutrients.children[3].children[0].nutrient_amount.displayValue) ? data.nutritionFacts.key_nutrients.children[3].children[0].nutrient_amount.displayValue : '';
          addElementToDocument('iio_nutrient_fiber', nfiber);
          const scounter = (data.nutritionFacts.serving_information.children[0].servings_per_container.displayValue) ? data.nutritionFacts.serving_information.children[0].servings_per_container.displayValue : '';
          addElementToDocument('iio_nutrient_servingsPerContainer', scounter);
        }
        const qunt = (data.store.price.salesQuantity) ? data.store.price.salesQuantity : '';
        addElementToDocument('iio_quantity', qunt);
        addElementToDocument('iio_available', (available ? 'In Stock' : 'Out of Stock'));
        addElementToDocument('iio_product_url', `https://grocery.walmart.com/product/${pid}`);
        // return;
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

      const addtionalDescBullets = getAllXpath("//div[@data-automation-id='details']//ul//li", 'innerText');
      if (addtionalDescBullets) {
        var additionalDescBulletText = addtionalDescBullets.join('|| ');
        addElementToDocument('addedAdditionaDescBullets', additionalDescBulletText);
      }
      const addtionalDesc = getAllXpath('//div[@data-automation-id="productAttributeShortDescription"]', 'innerText');
      var finalText = (additionalDescBulletText !== '') ? (addtionalDesc + ' | ' + additionalDescBulletText) : addtionalDesc;
      addElementToDocument('added_description', finalText);

      const specifications = getAllXpath("//div[@data-auid='specifications']//div[@role='list']", 'innerText');
      addElementToDocument('added_specifications', specifications);

      let netWeight = getXpath("//div[@role='list']//li[@data-auid='specifications_listing']//text()[contains(.,'weight')]", 'nodeValue');
      if (netWeight != null && netWeight.includes(':')) {
        netWeight = netWeight.split(':')[1];
      } else if (netWeight != null && netWeight.includes('-')) {
        netWeight = netWeight.split('-')[1];
      } else if (netWeight != null && netWeight.includes('weight')) {
        netWeight = netWeight.replace('weight', '');
      }
      addElementToDocument('added_netWeight', netWeight);

      let netSize = getXpath("//header[@data-auid='PDP_Size_heading']//div[@class='d-flex css-aw3xrg'] | //header[@data-auid='PDP_Shoe Size_heading']//div[@class='d-flex css-aw3xrg']", 'innerText');
      if (netSize != null) {
        netSize = netSize.split(':')[1];
      }
      addElementToDocument('added_netSize', netSize);

      let technicalDoc = getXpath("//div[@role='list']//a//@href", 'nodeValue');
      if (technicalDoc != null && technicalDoc.includes('https')) {
        technicalDoc = 'Yes';
      } else {
        technicalDoc = 'No';
      }
      addElementToDocument('added_technicalDoc', technicalDoc);

      addElementToDocument('added_variantCount', 0);
      if (document.querySelector('li.PDP_REVIEWS')) {
        // @ts-ignore
        document.querySelector('li.PDP_REVIEWS').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
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
      const ratingCount1 = getXpath('//div[@class="bv-control-bar"]//div[@class="bv-control-bar-count"]//span', 'innerText');
      if (ratingCount1) {
        const ratingArray = ratingCount1.split(' ');
        const ratingVal = ratingArray[2];
        addElementToDocument('added_ratingCount1', ratingVal);
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },

};
