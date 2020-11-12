const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    transform: cleanUp,
    domain: 'viking-direct.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await context.evaluate(async () => {
      const cookies = document.querySelector('button[id="footerCookiePolicyClose"]');
      if (cookies) cookies.click();
    });

    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.querySelector('body div#productPage').appendChild(catElement);
      }
      const availability = document.querySelector('div#productPage div.product-display__add-to-basket button[title="Add to basket"]') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);
      const pdfPresent = document.querySelector('div#productPage a.product-attachments-table__link') ? 'Yes' : 'No';
      addElementToDocument('pdfPresent', pdfPresent);
      const tAndCs = document.querySelector('a[href*=terms-conditions]') ? 'Yes' : 'No';
      addElementToDocument('tAndCs', tAndCs);
      const privacyPolicy = document.querySelector('a[href*=privacy_notice]') ? 'Yes' : 'No';
      addElementToDocument('privacyPolicy', privacyPolicy);
      const customerService = document.querySelector('div.footer-links a[href="/en/customer-service"]') ? 'Yes' : 'No';
      addElementToDocument('customerService', customerService);
      const zoomIn = document.querySelector('div#s7viewer_container_inner div[data-component="ZoomInButton"]') ? 'Yes' : 'No';
      addElementToDocument('zoomIn', zoomIn);

      const alternateImages = document.querySelectorAll('div#s7viewer_swatches_listbox div.s7thumb');
      for (let i = 1; i < alternateImages.length; i++) {
        if (alternateImages[i] && alternateImages[i].querySelector('div[type="image"]')) {
          const img = alternateImages[i] ? alternateImages[i].getAttribute('style').replace(/.*url\("(https.*\?).*/g, '$1') : '';
          addElementToDocument('alternateImg', img);
        }
      }

      const productId = document.querySelector('span[itemprop="sku"]') ? document.querySelector('span[itemprop="sku"]').innerText : '';
      const videos = document.querySelectorAll('div#s7viewer_swatches_listbox div.s7thumb div[type="video"]');
      for (let j = 1; j < videos.length + 1; j++) {
        const video = `https://odeu.scene7.com/is/content/odeu13/%21${productId}_v${j}`;
        addElementToDocument('video', video);
      }

      const specifications = document.querySelectorAll('div#contentproductSpecifications tr');
      const specificationsArr = [];
      for (let j = 0; j < specifications.length; j++) {
        const spec = specifications[j] && specifications[j].innerText ? specifications[j].innerText.replace(/\s+/g, ' ') : '';
        specificationsArr.push(spec);
      }
      addElementToDocument('specifications', specificationsArr.join(' || '));
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
