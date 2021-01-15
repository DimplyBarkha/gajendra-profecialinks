const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'next',
    transform: cleanUp,
    domain: 'next.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const dataConversion = (data, rpc = null) => {
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('alternateImages' in data[k].group[i]) {
            for (let j = 0; j < data[k].group[i].alternateImages.length; j++) {
              data[k].group[i].alternateImages[j].text = data[k].group[i].alternateImages[j].text.replace('AltItemThumb', 'AltItemShot');
              data[k].group[i].alternateImages[j].text = data[k].group[i].alternateImages[j].text.replace('minishot', 'shotview-315x472');
            }
          }
          if ('variantId' in data[k].group[i] && rpc !== null) {
            data[k].group[i].variantId[0].text = rpc;
          }
          if ('variantInformation' in data[k].group[i]) {
            data[k].group[i].variantInformation[0].text = data[k].group[i].variantInformation[0].text.split(' - Currently')[0];
          }
          if ('availabilityText' in data[k].group[i] && data[k].group[i].availabilityText[0].text !== 'Out of Stock') {
            data[k].group[i].availabilityText[0].text = 'In Stock';
          }
          if ('imageZoomFeaturePresent' in data[k].group[i] && data[k].group[i].imageZoomFeaturePresent[0].text !== 'No') {
            data[k].group[i].imageZoomFeaturePresent[0].text = 'Yes';
          }
        }
      }
      return data;
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      // remove popups
      if (document.querySelector('div[class="lightbox_background"]') !== null) {
        document.querySelector('div[class="countrySelector"]').remove();
        document.querySelector('div[class="lightbox_background"]').remove();
      };
      if (document.querySelector('div[class~="CookieConsent"]') !== null) {
        document.querySelector('div[class~="CookieConsent"]').remove();
      }
    });

    await context.evaluate(async () => {
      // add productUrl
      var productUrl = window.location.href;
      if (productUrl !== null) {
        const element = document.createElement('div');
        element.id = 'product-url';
        element.title = productUrl;
        element.style.display = 'none';
        document.body.appendChild(element);
      }
    });
    const rpc = await context.evaluate(() => {
      const rpc = [];
      const variantId = document.querySelectorAll('div[role="listbox"] ul li a');
      variantId.forEach(element => rpc.push(element.getAttribute('data-dk-dropdown-value')));
      return rpc;
    });
    const variants = await context.evaluate(() => { return document.querySelectorAll('div[class*="SizeSelector"] > div > ul > li > a').length; });
    if (variants > 1) {
      for (let i = 1; i < variants; i++) {
        await context.evaluate((i) => {
          document.querySelectorAll('div[class*="SizeSelector"] > div > ul > li > a')[i].click();
        }, i);
        // wait for extraction
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        dataConversion(await context.extract(productDetails, { transform }), rpc[i]);
      };
    }
    if (variants <= 1) {
      dataConversion(await context.extract(productDetails, { transform }));
    }
  },
};
