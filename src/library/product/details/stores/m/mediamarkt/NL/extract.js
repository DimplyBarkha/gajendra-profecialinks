const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: cleanUp,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const checkSelector = async (selector) => {
      return await context.evaluate((selector) => {
        if (document.querySelector(selector)) {
          return true;
        } else {
          return false;
        }
      }, selector)
    }
    const noResultSelector = `div[class="no_search_result_text"]`
    const isPresent = await checkSelector(noResultSelector);
    console.log(`this is the result for selector ${isPresent}`)
    if (isPresent) {
      console.log('no result xpath found hence no results returning')
      return;
    }
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const clickButton = document.querySelector('button[class*="btn--submit--al"]');
      if (clickButton) {
        clickButton.click()
      }
      const scripts = document.querySelectorAll('script');
      const eanScript = scripts && [...scripts].find(element => element.innerText.includes('"ean":'));
      const gtinData1 = eanScript && eanScript.innerText && eanScript.innerText.split('var') && eanScript.innerText.split('var').find(element => element.includes('ean')).trim();
      const gtinData = gtinData1 && gtinData1.trim() && gtinData1.trim().split('=') && gtinData1.trim().split('=')[1] && gtinData1.trim().split('=')[1].trim();
      const gtinObj = JSON.parse(gtinData && gtinData.substring(0, gtinData.lastIndexOf(';')));
      const gtin = gtinObj && gtinObj.ean;
      addElementToDocument('gtinvalue', gtin);

      const urlParams = new URLSearchParams(window.location.search);

      const specificationsButton = document.querySelector('.js-toggle-collapsed');
      if (specificationsButton) {
        specificationsButton.click();
      }

      // Getting specifications, size
      let weight = '';
      let color = '';
      let warranty = '';
      let mpc = '';
      let energy = '';
      let shippingDimensions = '';
      document.querySelectorAll('dl.specification').forEach(specificationGroup => {
        var specificationsItems = Array.from(specificationGroup.children);
        specificationsItems.forEach((item, index) => {
          // Getting weight
          if (item && item.innerText === 'Gewicht:') {
            weight = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
          // Getting color
          if (item && item.innerText === 'Kleur:') {
            color = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
          // Getting warranty
          if (item && item.innerText === 'Fabrieksgarantie:') {
            warranty = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
          // Getting mpc
          if (item && item.innerText === 'Manufacturer Part Number (MPN):' || item.innerText.includes('Modelnaam')) {
            mpc = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
          // Getting energy
          if (item && item.innerText === 'Energie-efficiëntieklasse:') {
            energy = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
          // Getting shipping dimensions
          if (item && item.innerText.includes('Verpakkingsvolume') || item && item.innerText.includes('Afmetingen')) {
            shippingDimensions = specificationsItems[index + 1] && specificationsItems[index + 1].innerText;
          }
        });
      });
      addElementToDocument('mm_weight', weight);
      addElementToDocument('mm_color', color);
      addElementToDocument('mm_warranty', warranty);
      addElementToDocument('mm_mpc', mpc);
      addElementToDocument('mm_energy', energy);
      addElementToDocument('mm_shippingDimensions', shippingDimensions);

      // Gets all specifications
      const specificationsElement = document.querySelector('#features');
      if (specificationsElement) {
        addElementToDocument('mm_specifications', specificationsElement.textContent.replace(/\r?\n/g, ' ').slice(0, -1).replace(/\s+|\s+/g, ' ').trim());
      }

      // Getting sku code
      const sku = urlParams.get('ga_query');
      addElementToDocument('mm_skuCode', sku);
      addElementToDocument('mm_retailerProductCode', sku);

      // Checking if in stock
      if (document.querySelector('.label-instock')) {
        addElementToDocument('mm_availabilityText', 'In Stock');
      }

      // Checking if image zoom feature present
      if (document.querySelector('.zoom')) {
        addElementToDocument('mm_imageZoomFeaturePresent', 'Yes');
      }

      // Getting base url
      addElementToDocument('mm_baseUrl', document.querySelector('link[rel=canonical]').href);

      // Getting description
      const descriptionElement = Array.from(document.querySelectorAll('#omschrijving p'));
      if (descriptionElement) {
        addElementToDocument('mm_description', descriptionElement.map(element => element && element.innerText.replace(/\r?\n/g, ' ').slice(0, -1)).join(' '));
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
