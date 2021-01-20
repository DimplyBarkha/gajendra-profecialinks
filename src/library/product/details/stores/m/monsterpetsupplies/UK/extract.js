// @ts-nocheck
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: cleanUp,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
  ],
  implementation: async ({ url, id }, { transform }, context, { productDetails }) => {
    const prodId = id;
    await context.evaluate((prodId) => {
      var getSiblings = function (elem) {
        // Setup siblings array and get the first sibling
        const siblings = [];
        let sibling = elem.parentNode.firstChild;

        // Loop through each sibling and push to the array
        while (sibling) {
          if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
          }
          sibling = sibling.nextSibling;
        }
        return siblings;
      };

      const addElementToDom = (element, id) => {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      };

      const skuNode = document.querySelector(`meta[content="${prodId}"]`);
      const productNode = getSiblings(skuNode);
      addElementToDom(prodId, 'sku');
      productNode.forEach((element) => {
        addElementToDom(element.getAttribute('content'), element.getAttribute('itemprop'));
      });

      const parentProdNode = skuNode.parentElement.parentElement;
      parentProdNode.setAttribute('target', 'to-add');

      const availRegExp = /http:\/\/schema\.org\/(.+)/;
      const availabilityElem = document.querySelector('div[id="availability"]');
      if (availabilityElem) {
        const availRaw = availabilityElem.textContent.match(availRegExp)[1];
        availabilityElem.textContent = availRaw === 'InStock' ? 'In Stock' : 'Out Of Stock';
      }

      // const variantElem = document.evaluate(
      //   `//div[@class="price-wrap" and contains(. , "${prodId}")]`,
      //   document,
      //   null,
      //   XPathResult.ANY_UNORDERED_NODE_TYPE,
      //   null,
      // ).singleNodeValue;

      const descriptionElem = document.querySelector('div[itemprop="description"]');
      const description = descriptionElem ? descriptionElem.innerText.replace(/\n+/g, ' ').trim() : '';
      addElementToDom(description, 'description');

      const fatRegexp = /[fF]at\s?([^\d\s]+)?\s?([\d,.]+)([\w%]{1,2})/;
      const fatMatch = description.toLowerCase().match(fatRegexp);
      if (fatMatch) {
        addElementToDom(fatMatch[2], 'fat_value');
        addElementToDom(fatMatch[3], 'fat_uom');
      }

      const ingredientsText = document.evaluate(
        '//p[. = "Ingredients:"]/following-sibling::*[position() = 1] | //p[starts-with(. , "Ingredients") or starts-with(. , "With Chicken:") or starts-with(. , "With Turkey:") or starts-with(. , "With Duck:") or starts-with(. , "With Poultry:") or starts-with(. , "With Salmon:") or starts-with(. , "With Fish:") or starts-with(. , "With Beef:")]',
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      ).stringValue;

      addElementToDom(ingredientsText.replace('Ingredients:', '').replace(/\n+/g, ' '), 'ingredients');

      const fullNameElem = document.querySelector('div#name');
      const quantityRegExp = /([\d,.]+[kgm]{1,2})/;
      if (fullNameElem && fullNameElem.textContent.match(quantityRegExp)) {
        addElementToDom(fullNameElem.textContent.match(quantityRegExp)[1], 'quantity');
      }

      document.querySelector('img[class="zoomImg"]') ? addElementToDom('Yes', 'Zoom') : addElementToDom('No', 'Zoom');
    }, prodId);

    return await context.extract(productDetails, { transform });
  },
};
