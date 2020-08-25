const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForXPath('//div[@class="s7staticimage"]/img');
      await context.waitForSelector('span.js-chosen-store-city-name');
      await context.evaluate(async function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const variants = [];
        const variantDetails = [];
        document.querySelectorAll('select[id="Size"] > option').forEach(async option => {
          !option.innerText.includes('Select') && variants.push(option.value);
        });
        for (const variant of variants) {
          const SKU = variant.split(':');
          const variantJson = await fetch(`https://api-triangle.canadiantire.ca/esb/PriceAvailability?SKU=${SKU[0]}&Store=0${SKU[1]}00&Banner=CTR&isKiosk=FALSE&Language=E`).then(res => res.json());
          if (variantJson.length) {
            const { Price, Product, SKU: sku } = variantJson[0];
            variantDetails.push({ Price, Product, sku });
          }
        }
        variantDetails.length && addHiddenDiv('variantDetails', JSON.stringify(variantDetails));
      });
      await context.click('div.pdp-image-carousel');
      await context.waitForXPath('//button[@class="pdp-image-carousel__item-video-thumbnail"]');
    } catch (error) {
      console.log(error);
    }
    return await context.extract(productDetails, { transform });
  },
};
