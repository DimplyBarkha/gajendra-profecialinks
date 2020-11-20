
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    transform: null,
    domain: 'petshop.ru',
    zipcode: '',
  },
  implementation: async ({ id }, parameters, context, { productDetails, transform }) => {
    await context.evaluate(async () => {
      const addedList = document.createElement('ol');
      addedList.id = 'variants_list';
      addedList.style.display = 'none';
      document.body.appendChild(addedList);
    });

    const variantsTotal = await context.evaluate(async () => document.querySelectorAll('div[class^="style_info"] div[class^="style_tile_wrapper"] > label').length);
    const iterations = variantsTotal || 1;
    for (let i = 0; i < iterations; i++) {
      if (variantsTotal > 1) {
        await context.evaluate(
          async ({ i }) => {
            document.querySelectorAll('div[class^="style_info"] div[class^="style_tile_wrapper"] > label')[i].click();
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
          { i },
        );
      }
      await context.evaluate(
        async ({ i, variantsTotal }) => {
          const addedList = document.querySelector('ol#variants_list');
          const listElem = document.createElement('li');

          const availableVariants = document.querySelectorAll('div[class^="style_info"] div[class^="style_tile_wrapper"] > label');
          if (availableVariants.length) {
            const variantElem = availableVariants[i];
          }

          const skuElem = document.evaluate('//div[contains(@class, "art") and starts-with(text(), "Арт")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const sku = skuElem && skuElem.match(/Арт(икул)?: (.+)/) ? skuElem.match(/Арт(икул)?: (.+)/)[2] : '';
          listElem.setAttribute('sku', sku);

          const brandElem = document.querySelector('a[class*="brand_name"], a[class*="ProductBrand"]');
          const brandName = brandElem ? brandElem.textContent : '';
          const brandLink = brandElem ? brandElem.getAttribute('href') : '';

          const name = document.querySelector('div[class^="style_info_product_name"] h1') ? document.querySelector('div[class^="style_info_product_name"] h1').textContent : '';

          const listPrice = document.querySelector('div.product-info div:not([class]) div.variant-list-price')
            ? document.querySelector('div.product-info div:not([class]) div.variant-list-price').textContent
            : '';
          const price = document.querySelector('div.product-info div:not([class]) div.product-price') ? document.querySelector('div.product-info div:not([class]) div.product-price').textContent : '';
          const availabilityText = document.querySelector('div.box-variants div.label-stock') ? document.querySelector('div.box-variants div.label-stock').textContent : '';
          const couponText = document.querySelector('div.product-info div.flag') ? document.querySelector('div.product-info div.flag').textContent : '';

          listElem.setAttribute('product_name', name);
          listElem.setAttribute('brand', brandName);
          listElem.setAttribute('brand_link', brandLink);
          listElem.setAttribute('name_extended', [brandName, name].join(' - '));
          listElem.setAttribute('variant_count', variantsTotal);
          listElem.setAttribute('list_price', listPrice);
          listElem.setAttribute('price', price);
          listElem.setAttribute('availability_text', availabilityText);
          listElem.setAttribute('coupon_text', couponText);

          addedList.appendChild(listElem);
        },
        { i, variantsTotal },
      );
    }
    await context.extract(productDetails, { transform });
  },
};
