
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Fetching brand from JSON and if not available then first word from the product name
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch variantId
    function fetchVariantId () {
      const variantId = window.analyticsData ? window.analyticsData.product ? window.analyticsData.product.DefaultEdp ? window.analyticsData.product.DefaultEdp : '' : '' : '';
      addHiddenDiv('added_variantId', variantId);
    }

    // Function to fetch variants
    function fetchVariants () {
      const productDetails = window.analyticsData ? window.analyticsData.product ? window.analyticsData.product.Edps : [] : [];
      const variantArray = [];
      let variants;
      // If the product details fetched from JSON are blank then add the current variant
      if (productDetails.length === 0) {
        variants = window.analyticsData ? window.analyticsData.product ? window.analyticsData.product.DefaultEdp ? window.analyticsData.product.DefaultEdp : '' : '' : '';
      } else {
        for (let i = 0; i < productDetails.length; i++) {
          const variantNumber = productDetails[i].EdpNo;
          variantArray.push(variantNumber);
        }
        variants = variantArray.join(' | ');
      }
      addHiddenDiv('added_variants', variants);
      addHiddenDiv('added_variantCount', variantArray.length);
    }

    // Function to fetch color and add to DOM
    function fetchColor () {
      let colorSelector = document.evaluate('//label[@class="style-swatch-label style-selected"]/@title', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      let color = '';
      if (!colorSelector) {
        colorSelector = document.querySelector('div[id="infoTabContent"] div[id="tab0"]');
        const colorSelectorText = colorSelector ? colorSelector.innerText : '';
        if (colorSelectorText.includes('Colour')) {
          color = colorSelectorText.replace(/\n/gm, '').replace(/.*Colour: ?(\w+\/?\w+).*/gm, '$1');
        }
      } else {
        color = colorSelector.value;
      }
      addHiddenDiv('added_color', color);
    }

    // Function to fetch gtin from script tag as not available directly on DOM.
    function fetchGtinFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@id="jsonld"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const gtin = scriptTagData ? scriptTagData.replace(/\n/gm, '').replace(/.*gtin12.*?(\d+).*/gm, '$1') : '';
      if (gtin.length < 15) {
        addHiddenDiv('added_gtin', gtin);
      }
    }

    const brandSelector = document.querySelector('div[data-id="productData"]');
    const brandJSON = brandSelector ? brandSelector.getAttribute('data-value') : '';
    const brandObj = JSON.parse(brandJSON);
    let brand = brandObj.Brand;
    if (!brand) {
      const nameSelector = document.querySelector('h1[id="lblProductName"]');
      const name = nameSelector ? nameSelector.innerText : '';
      brand = name ? name.replace(/^([\w]+).*/gm, '$1') : '';
    }
    addHiddenDiv('added-brand', brand);

    // Adding additional description bullet info by looping through description as li tags are not avaialble on webpage
    const descriptionSelector = document.querySelector('div[id="infoTabContent"] div[id="tab0"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    const descriptionArray = description ? description.split('\n') : [];
    const bulletInfoArray = [];
    for (let i = 0; i < descriptionArray.length; i++) {
      const descObj = descriptionArray[i];
      if (descObj.includes('•')) {
        bulletInfoArray.push(descObj.replace('•', ' || '));
      }
    }
    const additionalDescBulletInfo = bulletInfoArray.join('');
    addHiddenDiv('added-additionalDescBulletInfo', additionalDescBulletInfo.replace(/^ ?\|\|/gm, '').trim());
    fetchGtinFromScript();
    fetchVariantId();
    fetchVariants();
    fetchColor();

    const secImage = document.evaluate('//div[@class="slick-track"]/div[not(contains(@class,"video")) and not(@data-index="1")]//img/@src', document, null, XPathResult.ANY_TYPE, null);
    let mainImage = document.evaluate(' (//div[@id="divImageGallery"]//figure//img//@src)[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    mainImage = mainImage ? mainImage.singleNodeValue.nodeValue : false;
    let thisImage = secImage.iterateNext();
    const allImages = [];
    while (thisImage) {
      const imageUrl = thisImage.textContent.replace('=XXS', '=XL');
      allImages.push(imageUrl);
      thisImage = secImage.iterateNext();
    }
    //@ts-ignore.
    const imageArray = [...new Set(allImages)].filter(u => u !== mainImage);
    document.querySelector('body').setAttribute('sec-images', imageArray.join(' | '));
  });

  await new Promise(resolve => setTimeout(resolve, 20000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform,
    domain: 'tsc.ca',
    zipcode: '',
  },
  implementation,
};
