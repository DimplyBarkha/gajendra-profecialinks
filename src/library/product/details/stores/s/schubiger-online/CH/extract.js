
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function fetchBrandAndAvailabilityText () {
    // Fetching brand from window object and adding availabilityText
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const brand = window.utag_data ? window.utag_data ? window.utag_data.product_attributes_brand ? window.utag_data.product_attributes_brand.length ? window.utag_data.product_attributes_brand[0] : '' : '' : '' : '';
      addHiddenDiv('added_brandText', brand);

      const availabilityTextSelector = document.querySelector('div[class*="add-to-cart ember-view"]');
      const availabilityText = availabilityTextSelector ? 'In Stock' : 'Out Of Stock';
      addHiddenDiv('added_availabilityText', availabilityText);
    });
  }

  async function fetchGtinFromScript () {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
      const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
      let scriptTagJSON = '';
      try {
        scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSON = '';
      }
      const gtin = scriptTagJSON ? scriptTagJSON.gtin12 ? scriptTagJSON.gtin12 : '' : '';
      addHiddenDiv('added_gtin', gtin);
    });
  }

  async function openProductDetailsTab () {
    // Clicking on the product specifications and other tabs to load product details on the DOM
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (document.querySelector('span[data-component*="product-specification"]')) {
        const expandableSpan = document.querySelector('span[data-component*="product-specification"]');
        const expandableAnchor = expandableSpan.parentNode;
        expandableAnchor.click();
        if (document.querySelector('table[class*="product-specification"]')) {
          const tbl = document.querySelector('table[class*="product-specification"]');
          const tblRows = tbl.querySelectorAll('tr[class*="product-specifications"]');
          let specsString = '';
          for (let i = 0; i < tblRows.length; i++) {
            specsString += tblRows[i].querySelector('th').innerText + ' || ';
            specsString += tblRows[i].querySelector('td span').innerText + ' || ';
          }
          addHiddenDiv('specs', specsString);
        }
      }

      const infoTabSelector = document.querySelectorAll('div[class*="accordion__item"] div[class*="accordion__item-head"]');
      for (let i = 0; i < infoTabSelector.length; i++) {
        const infoTab = infoTabSelector[i];
        infoTab && infoTab.click();
      }

      /**
       * Sometimes another 2nd relevant product is also available on the same page hence removing it from DOM
       * Then clicking on the product specifications and other tabs to load product details on the DOM except the first
       * tab as it will be already open in which the 2nd relevant product details were present
       */
      const extraProductSelector = document.querySelector('div[class*="accordion__item"] div[class*="detail__wrapper"]');
      if (extraProductSelector) {
        extraProductSelector.remove();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        const infoTabSelector = document.querySelectorAll('div[class*="accordion__item"] div[class*="accordion__item-head"]');
        for (let i = 1; i < infoTabSelector.length; i++) {
          console.log('Opening tech details tab');
          const infoTab = infoTabSelector[i];
          infoTab && infoTab.click();
        }
      }
    });
  }

  await fetchBrandAndAvailabilityText();
  await fetchGtinFromScript();
  await openProductDetailsTab();

  await context.evaluate( async function () {

    async function timeout(ms) {
    console.log('waiting for ' + ms + ' millisecs');
    return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
  
    const xpathForVideoSec = '//div[contains(@class,"tabs-tablist")]/a[contains(.,"Produktvideo")]'
    let videoSecToClick = document.evaluate(xpathForVideoSec, document, null, 7, null);
    if (videoSecToClick.snapshotLength > 0) {
      console.log('we have the video section to click');
      // we are considering the first element to click
      videoSecToClick.snapshotItem(0).click();
    } else {
      console.log('Either the xpath for video sec is wrong or video is not loaded yet');
    }
  
    await timeout(5000);
  
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    transform,
    domain: 'schubiger-online.ch',
    zipcode: '',
  },
  implementation,
};
