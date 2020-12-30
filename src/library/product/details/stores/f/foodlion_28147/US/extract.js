const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodlion_28147',
    transform: cleanUp,
    domain: 'foodlion.com',
    zipcode: '28147',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    async function addElement ({ id, xp }) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const jsonData = JSON.parse((document.querySelector('script[type*="application/ld+json"]').innerText).trim());
      if (jsonData && !document.getElementById('pd_sku')) {
        jsonData.sku && addHiddenDiv('pd_sku', jsonData.sku);
      }
      if (jsonData && !document.getElementById('pd_brand')) {
        jsonData.brand && jsonData.brand.name && addHiddenDiv('pd_brand', jsonData.brand.name);
      }
      const imageCount = document.evaluate('//div[contains(@class,"product-image-thumbnails")]/button[position( ) > 1]/span[contains(@class,"product-image-thumbnail")]/@style', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      !document.getElementById('image_count') && imageCount.snapshotLength && addHiddenDiv('image_count', imageCount.snapshotLength);
      const elementFound = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      elementFound && addHiddenDiv(id, elementFound.innerText);
    }
    try {
      await context.click('div[class*="show-more-description"]');
    } catch (error) {
      console.log('Click show more button not present');
    }
    try {
      await context.click('#tab-ingredients');
      await context.evaluate(addElement, { id: 'pd_ingredients', xp: '//div[contains(@id,"panel-ingredients")]' });
    } catch (error) {
      console.log('Ingredients not present');
    }
    try {
      await context.click('#tab-instructions');
      await context.evaluate(addElement, { id: 'pd_directions', xp: '//div[contains(@id,"panel-instructions")]' });
    } catch (error) {
      console.log('Directions not present');
    }
    try {
      await context.click('#tab-warnings');
      await context.evaluate(addElement, { id: 'pd_warnings', xp: '//div[contains(@id,"panel-warnings")]' });
    } catch (error) {
      console.log('warnining not present');
    }
    try {
      await context.click('#tab-nutrition');
    } catch (error) {
      console.log('Nutrition button click failed');
    }
    try {
      await context.evaluate(async function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const jsonData = JSON.parse((document.querySelector('script[type*="application/ld+json"]').innerText).trim());
        if (jsonData && !document.getElementById('pd_sku')) {
          jsonData.sku && addHiddenDiv('pd_sku', jsonData.sku);
        }
        if (jsonData && !document.getElementById('pd_brand')) {
          jsonData.brand && jsonData.brand.name && addHiddenDiv('pd_brand', jsonData.brand.name);
        }
      });
    } catch (error) {
      console.log('Failed to add ID');
    }
    return await context.extract(productDetails, { transform: transformParam });
  },
};
