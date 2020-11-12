const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: cleanUp,
    domain: 'lookfantastic.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function findLabel (productObj, label) {
        const value = productObj[label];
        if (Array.isArray(value)) {
          return {
            label: value.reduce((prevVal, currentVal) => {
              return (prevVal) ? prevVal + ',' + currentVal : currentVal;
            }, ''),
          };
        } else if (value) {
          return { label: value };
        }
        return null;
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function findAndInsertLabel (obj, labelName, outputName) {
        const result = findLabel(obj, labelName);
        if (result != null) {
          addHiddenDiv('ii_' + outputName, result.label);
        }
      }
      // @ts-ignore
      const jsonString = document.querySelector("script[type='application/ld+json']").innerText;
      let jsonParsed = {};
      if (jsonString && jsonString.trim()) {
        jsonParsed = JSON.parse(jsonString);
        findAndInsertLabel(jsonParsed, 'image', 'image');
        findAndInsertLabel(jsonParsed, 'category', 'category');
        findAndInsertLabel(jsonParsed, 'name', 'nameExtended');
        findAndInsertLabel(jsonParsed, 'description', 'description');
        findAndInsertLabel(jsonParsed, 'sku', 'sku');
        findAndInsertLabel(jsonParsed, 'mpn', 'mpc');
        if (jsonParsed.offers && jsonParsed.offers[0]) {
          const availabilityText = (findLabel(jsonParsed.offers[0], 'availability') && findLabel(jsonParsed.offers[0], 'availability').label.includes('InStock')) ? 'In Stock' : 'Out of stock';
          addHiddenDiv('ii_availabilityText', availabilityText);
        }
        if (jsonParsed.brand) {
          findAndInsertLabel(jsonParsed.brand, 'name', 'brandText');
        }
        if (jsonParsed.aggregateRating) {
          if (jsonParsed.aggregateRating.reviewCount) findAndInsertLabel(jsonParsed.aggregateRating, 'reviewCount', 'ratingCount');
          if (jsonParsed.aggregateRating.ratingValue) findAndInsertLabel(jsonParsed.aggregateRating, 'ratingValue', 'aggregateRatingText');
        }
        if (jsonParsed.description) {
          const result = findLabel(jsonParsed, 'description');
          if (result != null && result.label.includes('Tolerance :')) {
            addHiddenDiv('ii_warnings', result.label.replace(/.*Tolerance :(.*)/, '$1'));
          }
        }
      }
      let listPrice = '';
      if (document.querySelector('p.productPrice_rrp')) {
        // @ts-ignore
        listPrice = (document.querySelector('p.productPrice_rrp').innerText).replace(/.*:(.*)/, '$1').trim();
      }
      if (listPrice) addHiddenDiv('ii_listPrice', listPrice);
  
      if (document.querySelectorAll("select[id*='product-variation-dropdown'] option")) {
        let variantCount = document.querySelectorAll("select[id*='product-variation-dropdown'] option").length;
        variantCount = variantCount > 1 ? variantCount - 1 : variantCount;
        if (variantCount > 0) addHiddenDiv('ii_variantCount', variantCount);
      }
      if (document.querySelectorAll("div[class*='firstColumn'] div[class*='productDescription'] ul li")) {
        const descriptionBullets = document.querySelectorAll("div[class*='firstColumn'] div[class*='productDescription'] ul li").length;
        if (descriptionBullets > 0) addHiddenDiv('ii_descriptionBullets', descriptionBullets);
      }
      if (document.querySelector("div[class='productDeliveryAndReturns']")) {
        // @ts-ignore
        const shippingInfo = document.querySelector("div[class='productDeliveryAndReturns']").innerText;
        if (shippingInfo) addHiddenDiv('ii_shippingInfo', shippingInfo);
      }
      if (document.querySelectorAll("ul[aria-label='Product Images'] li img")) {
        const alternateImages = [];
        const node = document.querySelectorAll("ul[aria-label='Product Images'] li img");
        for (const i in node) {
          // @ts-ignore
          if (node[i].src) alternateImages.push(node[i].src);
        }
        if (alternateImages) addHiddenDiv('ii_alternateImages', alternateImages.join('|'));
      }
      // @ts-ignore
      let directions = (document.querySelector("div[data-information-component*='directions']")) ? document.querySelector("div[data-information-component*='directions']").innerText : '';
      if (!directions) {
        directions = document.evaluate("(//div[contains(@class,'productDescription_synopsisContent')]/p[contains(text(),'Direction')]/following-sibling::ul)[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (directions) directions = directions.textContent;
      }
      if (directions) addHiddenDiv('ii_directions', directions);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
  
};
