const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const availabilitySelector = 'div[class="availabilityBox n-availabilityBox"] div[class*="availability stati"]';
    await context.evaluate((availabilitySelector) => {
      const waitForProducts = async () => {
        // @ts-ignore
        function timeout(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        // @ts-ignore
        async function waitForElementWithTimeout(selector, reloadSec, maxTime) {
          let element = document.querySelector(selector);
          let count = 0;
          while (element === null) {
            count = count + reloadSec;
            element = document.querySelector(selector);
            await timeout(reloadSec);
            if (count >= +maxTime) {
              console.log("Element not found");
              return false;
            }
          }
          return true;
        }
        // Wait for related product details list
        const isRelatedProductFound = await waitForElementWithTimeout("div#inpage_container img", 200, 30000);
        if (isRelatedProductFound === false) {
          console.log("Related product details not found");
        }
        return;
      };
      waitForProducts();
      let getEnhancedContent = document.querySelectorAll('div#flix-inpage div.inpage_block_title');
      let getManufacturerDescription = [];
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('div#flix-inpage div.flix-std-title');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('div#flix-inpage div.flix-std-desc');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('div#flix-inpage div.flix-std-section');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('div#flix-inpage div.inpage_h4');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('div#flix-inpage div.flix-d-p');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      getEnhancedContent = document.querySelectorAll('table.flix-std-specs-table span');
      for (i = 0; i < getEnhancedContent.length; i++) {
        getManufacturerDescription.push(getEnhancedContent[i].innerText);
      }
      manufacturerdescription = getManufacturerDescription.join();
      document.body.setAttribute('manufacturerdescription', manufacturerdescription);
      
      let stockText = '';
      const availabilityStatus = document.querySelector(availabilitySelector).innerText;
      if (availabilityStatus.includes('sofort lieferbar')) { stockText = 'In Stock'; } else if (availabilityStatus.includes('innert 1-2 Wochen')) { stockText = 'In Stock'; } else if (availabilityStatus.includes('momentan nicht kaufbar')) { stockText = 'Out Of Stock'; } else if (availabilityStatus.includes('Lieferung ab')) { stockText = 'Out Of Stock'; } else if (availabilityStatus.includes('Liefertermin nicht')) {
        const regionalAvailability = 'div[class*="filialeAvailability stati"]';
        const regionalAvailabilityStatus = document.querySelector(regionalAvailability).innerText;
        if (regionalAvailabilityStatus.includes('momentan nicht kaufbar')) { stockText = 'Out Of Stock'; } else { stockText = 'In Stock'; }
      }
      document.body.setAttribute('availability', stockText);
    }, availabilitySelector);

    return await context.extract(productDetails, { transform });
  },
};
