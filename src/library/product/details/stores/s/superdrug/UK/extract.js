const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    /** Function used to extract all paragraph's text between two given titles.
       * If no 'startTitle' provided, it starts adding from the beginning.
       * If no 'stopTitle' provided, it doesn't stop and adds everything to the end
       * @param {object} node Parent node of all elements we want to iterate over
       * @param {Array} startTitle List of paragraph's textContent that once we meet we start adding following paragraph's text
       * @param {Array} stopTitleArray Lisf of paragraph's textContent that once we meet we stop adding following paragraph's text
       */

    const addFollowingParagraphs = (key, node, startTitle, stopTitleArray) => {
      const elements = document.createElement('div');
      elements.id = key;
      elements.style.display = 'none';
      let reading;
      const allElements = node.childNodes;
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        if (!startTitle || startTitle.some((startTitleElem) => element.textContent.toLowerCase().trim() === startTitleElem.toLowerCase())) reading = true;
        if (stopTitleArray && stopTitleArray.length && stopTitleArray.some((stopTitleElem) => element.textContent.toLowerCase().trim() === stopTitleElem.toLowerCase())) break;
        if (reading) {
          elements.appendChild(element.cloneNode(true));
        }
      }
      document.body.appendChild(elements);
    };

    const description = document.querySelector('#pdp__details section');
    const descriptionHeading = ['Product Information'];
    const descriptionEnd = ['Product Specification', 'Warnings or Restrictions', 'Product Uses'];
    if (description) addFollowingParagraphs('description', description, descriptionHeading, descriptionEnd);

    const allHeadings = document.querySelectorAll('#pdp__details article h3.pdp-details__sub-title');
    for (let i = 0; i < allHeadings.length; i++) {
      if (allHeadings[i].textContent === 'Product Specification') {
        const ingredientsText = allHeadings[i].parentElement;
        console.log(ingredientsText);
        const ingredientsHeading = ['Product Specification'];
        const ingredientsEnd = ['Size'];
        if (ingredientsText) addFollowingParagraphs('ingredients', ingredientsText, ingredientsHeading, ingredientsEnd);
      }
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    // set gtin
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i].innerText;
      if (script.includes('gtin8')) {
        addElementToDocument('gtin', script.match(/"gtin8": "(\d+)"/)[1]);
      }
    }

    const prefix = 'https://www.superdrug.com';
    const brandName = document.querySelector('span.pdp__byBrand>a') ? document.querySelector('span.pdp__byBrand>a').getAttribute('href') : null;
    if (brandName !== null) {
      const brandLink = brandName.replace(/\s/g, '%20');
      // @ts-ignore
      addElementToDocument('brandlink', `${prefix}${brandLink}`);
    }

    const isImgZoom = document.querySelector('div.pdp-gallery__large-img')
      ? document.querySelector('div.pdp-gallery__large-img') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }
    // @ts-ignore
    const variants = [...document.querySelectorAll('*[id=addToCartForm] div > a')].map(el => {
      return `${el.innerText} - ${el.getAttribute('href').match(/(\d+)$/)[0]}`;
    });
    variants.forEach((variant, index) => {
      addElementToDocument(`added-variant-${index}`, variant);
    });
    const terms = document.evaluate('//a[contains(@class,"footer")][text()="Terms & Conditions"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    const privacy = document.evaluate('//a[contains(@class,"footer")][text()="Privacy Policy"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    const customerService = document.evaluate('//h4[contains(@class,"footer")][text()="Customer Service"][1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (terms) addElementToDocument('added-terms', 'Yes');
    if (privacy) addElementToDocument('added-privacy', 'Yes');
    if (customerService) addElementToDocument('added-customer-service', 'Yes');
    // @ts-ignore
    const secondaryImages = [...document.querySelectorAll('#thumbnails img')].map(el => 'https://www.superdrug.com' + el.getAttribute('src')).slice(1);
    if (secondaryImages.length) {
      addElementToDocument('added-total-sec-img', secondaryImages.length);
      secondaryImages.forEach((img, index) => {
        addElementToDocument(`added-sec-img-${index}`, img);
      });
    }
    const pricePerUnit = document.evaluate('//p[contains(@class,"pricing__per-item")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (pricePerUnit && pricePerUnit.match(/per\s?(.+)/)) addElementToDocument('added-price-uom', pricePerUnit.match(/per\s?(.+)/)[1]);
    const availability = document.querySelector('span[itemprop=availability]') ? document.querySelector('span[itemprop=availability]').textContent : '';
    if (availability === 'outOfStock') {
      addElementToDocument('added-availability', 'Out Of Stock');
    } else if (availability === 'inStock' || availability === 'lowStock') {
      addElementToDocument('added-availability', 'In Stock');
    }
  });
  // return await context.extract(productDetails, { transform });
  const dataRef = await context.extract(productDetails, { transform });

  if (dataRef[0].group[0].brandText) {
    dataRef[0].group[0].brandText[0].text = dataRef[0].group[0].brandText[0].text.replace("'", '');
  }
  if (dataRef[0].group[0].description) {
    dataRef[0].group[0].description[0].text = dataRef[0].group[0].description[0].text.replace('Product Information', '').trim();
    const descriptionTxt = dataRef[0].group[0].description[0].text;
    const index = descriptionTxt.indexOf('Product Specification');
    const index2 = descriptionTxt.indexOf('Warnings or Restrictions');
    if (index !== -1) {
      dataRef[0].group[0].description[0].text = dataRef[0].group[0].description[0].text.slice(0, index).trim();
    } if (index2 !== -1) {
      dataRef[0].group[0].description[0].text = dataRef[0].group[0].description[0].text.slice(0, index2).trim();
    }
  }
  if (dataRef[0].group[0].ingredientsList) {
    dataRef[0].group[0].ingredientsList[0].text = dataRef[0].group[0].ingredientsList[0].text.replace('Product Specification', '').trim();
    const sizeTxt = dataRef[0].group[0].ingredientsList[0].text;
    const index = sizeTxt.indexOf('Size');
    if (index !== -1) {
      dataRef[0].group[0].ingredientsList[0].text = dataRef[0].group[0].ingredientsList[0].text.slice(0, index).trim();
    }
  }
  if (dataRef[0].group[0].directions) {
    dataRef[0].group[0].directions[0].text = dataRef[0].group[0].directions[0].text.replace('Product Uses', '').trim();
  }
  if (dataRef[0].group[0].sku || dataRef[0].group[0].variantId) {
    dataRef[0].group[0].sku[0].text = dataRef[0].group[0].sku[0].text.replace('Product code:', '').trim();
    dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.replace('Product code:', '').trim();
  }
  return dataRef;
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: cleanUp,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation,
};
