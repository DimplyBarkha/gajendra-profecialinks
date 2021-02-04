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
    await context.evaluate((prodId) => {
      const addElementToDom = (element, id) => {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      };

      const allVariants = document.querySelectorAll('div.price-wrap section.monster-product-desc-details');
      for (let i = 0; i < allVariants.length; i++) {
        const variantElem = allVariants[i];
        const name = document.querySelector('h1[itemprop="name"]') ? document.querySelector('h1[itemprop="name"]').textContent : '';
        const price = variantElem.querySelector('p.varient-price')
          ? variantElem.querySelector('p.varient-price').textContent
          : '';
        const listPrice = variantElem.querySelector('p.discount')
          ? variantElem.querySelector('p.discount').textContent.replace('RRP:', '').trim()
          : '';
        const variantName = variantElem.querySelector('h5.variant-title')
          ? variantElem.querySelector('h5.variant-title').textContent
          : '';
        const sku = document
          .evaluate('.//p[contains(text(), "SKU")]', document, null, XPathResult.STRING_TYPE, null)
          .stringValue.replace('SKU:', '')
          .trim();
        const promotion = variantElem.querySelector('span.product-offer-text')
          ? variantElem.querySelector('span.product-offer-text').textContent
          : '';
        const availability = variantElem.querySelector('p.stock-alert') ? 'Out Of Stock' : 'In Stock';

        variantElem.setAttribute('name_extended', `${name} - ${variantName}`);
        variantElem.setAttribute('price', price);
        variantElem.setAttribute('list_price', listPrice);
        variantElem.setAttribute('variant_name', variantName);
        variantElem.setAttribute('sku', sku);
        variantElem.setAttribute('promotion', promotion);
        variantElem.setAttribute('availability', availability);
      }

      addElementToDom(allVariants.length, 'variant_count');
      const descriptionElem = document.querySelector('div[itemprop="description"]');
      const description = descriptionElem ? descriptionElem.innerText.replace(/\n+/g, ' ').trim() : '';
      addElementToDom(description, 'description');

      const fatRegExp = /fat\s?([^\d\s]+)?\s?([\d,.]+)([\w%]{1,2})/i;
      const fatMatch = description.match(fatRegExp);
      if (fatMatch) {
        addElementToDom(fatMatch[2], 'fat_value');
        addElementToDom(fatMatch[3], 'fat_uom');
      }

      const proteinRegExp = /protein\s?([^\d\s]+)?\s?([\d,.]+)([\w%]{1,2})/i;
      const proteinMatch = description.match(proteinRegExp);
      if (proteinMatch) {
        addElementToDom(proteinMatch[2], 'protein_value');
        addElementToDom(proteinMatch[3], 'protein_uom');
      }

      const fibreRegExp = /fibre\s?([^\d\s]+)?\s?([\d,.]+)([\w%]{1,2})/i;
      const fibreMatch = description.match(fibreRegExp);
      if (fibreMatch) {
        addElementToDom(fibreMatch[2], 'fibre_value');
        addElementToDom(fibreMatch[3], 'fibre_uom');
      }

      const calciumRegExp = /calcium\s?([^\d\s]+)?\s?([\d,.]+)([\w%]{1,2})/i;
      const calciumMatch = description.match(calciumRegExp);
      if (calciumMatch) {
        addElementToDom(calciumMatch[2], 'calcium_value');
        addElementToDom(calciumMatch[3], 'calcium_uom');
      }

      const vitARegExp = /\((.{1,2}\/kg)\).*vit\. a\s?([^\d\s]+)?\s?([\d,.]+)/i;
      const vitAMatch = description.match(vitARegExp);
      if (vitAMatch) {
        addElementToDom(vitAMatch[3], 'vit_a_value');
        addElementToDom(vitAMatch[1], 'vit_a_uom');
      }

      const vitCRegExp = /\((.{1,2}\/kg)\).*vit\. c\s?([^\d\s]+)?\s?([\d,.]+)/i;
      const vitCMatch = description.match(vitCRegExp);
      if (vitCMatch) {
        addElementToDom(vitCMatch[3], 'vit_c_value');
        addElementToDom(vitCMatch[1], 'vit_c_uom');
      }

      let ingredientsText = document.evaluate(
        '//p[. = "Ingredients:"]/following-sibling::*[position() = 1] | //p[starts-with(. , "Ingredients") or starts-with(. , "With Chicken:") or starts-with(. , "With Turkey:") or starts-with(. , "With Duck:") or starts-with(. , "With Poultry:") or starts-with(. , "With Salmon:") or starts-with(. , "With Fish:") or starts-with(. , "With Beef:")]',
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      ).stringValue;
      ingredientsText = ingredientsText.replace(/^ingredients:?/i, '').trim();

      const ingredientsTextArr = [];
      if (!ingredientsText && descriptionElem) {
        let reading;
        for (let i = 0; i < descriptionElem.childNodes.length; i++) {
          const elem = descriptionElem.childNodes[i];
          if (elem.textContent.toLowerCase().trim().startsWith('ingredients')) reading = true;
          if (
            elem.textContent.toLowerCase().trim().startsWith('analytical constituent') ||
            elem.textContent.toLowerCase().trim().startsWith('nutritional additive') ||
            elem.textContent.toLowerCase().trim().startsWith('feeding guideline')
          ) {
            break;
          }
          if (reading) ingredientsTextArr.push(elem.textContent);
        }
        ingredientsText = ingredientsTextArr
          .join(' ')
          .replace(/^ingredients:?/i, '')
          .trim();
      }

      addElementToDom(ingredientsText.replace('Ingredients:', '').replace(/\n+/g, ' '), 'ingredients');
      document.querySelector('img[class="zoomImg"]') ? addElementToDom('Yes', 'Zoom') : addElementToDom('No', 'Zoom');
    });

    return await context.extract(productDetails, { transform });
  },
};
