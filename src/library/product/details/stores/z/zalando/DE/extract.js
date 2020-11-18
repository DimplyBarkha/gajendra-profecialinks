const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    transform: cleanUp,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    const numOfThumbnails = await context.evaluate(async () => {
      return document.querySelectorAll('div[class*="sticky-gallery"] ul button').length;
    });
    for (let i = 1; i <= numOfThumbnails; i++) {
      await context.click(`div[class*="sticky-gallery"] ul > li:nth-of-type(${i}) button`);
    }

    await context.click('x-wrapper-re-1-5 button[id="picker-trigger"]');
    const numOfVariants = await context.evaluate(async () => document.querySelectorAll('form[name="size-picker-form"] div[role="presentation"] label').length);
    const iterations = numOfVariants || 1;
    for (let i = 1; i <= iterations; i++) {
      if (numOfVariants) {
        await context.click(`form[name="size-picker-form"] div[role="presentation"]:nth-of-type(${i}) label`);
      }

      await context.evaluate(async () => {
        const closeButton = document.querySelector('div[role="modal"][style="z-index: 100005;"] button svg > title[id^="cross"]');
        if (closeButton) {
          console.log('closing modal');
          closeButton.parentElement.parentElement.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      });

      await context.evaluate(
        async ({ i }) => {
          const addedVariant = document.createElement('div');
          addedVariant.id = `added_variant${i}`;
          addedVariant.style.display = 'none';
          const variantElement = document.querySelector(`form[name="size-picker-form"] div[role="presentation"]:nth-of-type(${i})`);
          const extraDataScript = document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]')
            ? document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]').textContent
            : '';
          const extraDataObj = JSON.parse(extraDataScript.substr(9, extraDataScript.length - 12));

          const priceRow = document.querySelector('x-wrapper-re-1-3 > div > div');
          const priceElements = document.evaluate('.//span[text() and not(contains(text(), "VAT"))]', priceRow, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          const price = priceElements.snapshotItem(0) ? priceElements.snapshotItem(0).textContent : '';
          const listPrice = priceElements.snapshotItem(1) ? priceElements.snapshotItem(1).textContent : '';

          addedVariant.setAttribute('price', price);
          addedVariant.setAttribute('list_price', listPrice);

          let availabilityText = 'In stock';
          let variantName = '';
          if (variantElement) {
            const sku = document.evaluate(
              '//div[@class="z-pdp__escape-grid"]//button//span[text()="Details" or text()="Highlights"]/ancestor::h2/following-sibling::div//span[text()="Article number"]/following-sibling::span',
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            ).stringValue;
            const productCode = variantElement.querySelector('input').value;
            const variantId = productCode.replace(sku, '');

            variantName = variantElement.querySelector('span > div > span:nth-of-type(1)') ? variantElement.querySelector('span > div > span:nth-of-type(1)').textContent : '';

            const availabilityElem = variantElement.querySelector('label > div');
            if (availabilityElem && availabilityElem.textContent) availabilityText = availabilityElem.textContent;
            if (availabilityText === 'Notify Me') {
              availabilityText = 'Out of stock';
            }

            addedVariant.setAttribute('variant_id', variantId);
          }
          addedVariant.setAttribute('availability_text', availabilityText);

          const brand = document.querySelector('x-wrapper-re-1-3 h3') ? document.querySelector('x-wrapper-re-1-3 h3').textContent.trim() : '';
          const productName = document.querySelector('x-wrapper-re-1-3 > h1') ? document.querySelector('x-wrapper-re-1-3 > h1').textContent.trim() : '';
          const nameExtended = [brand, productName];
          if (variantName) nameExtended.push(variantName);

          addedVariant.setAttribute('name_extended', nameExtended.join(' - '));

          if (extraDataScript && extraDataObj) {
            const ratingCount = extraDataObj.model.articleInfo.reviewsCount;
            let aggregateRating = extraDataObj.model.articleInfo.averageStarRating;
            if (aggregateRating) aggregateRating = (Math.round(aggregateRating * 10) / 10).toString().replace('.', ',');
            addedVariant.setAttribute('rating_count', ratingCount);
            addedVariant.setAttribute('aggregate_rating', aggregateRating);
          }

          document.body.appendChild(addedVariant);
        },
        { i },
      );
      await context.click('x-wrapper-re-1-5 button[id="picker-trigger"]');
    }

    await context.evaluate(
      async ({ iterations }) => {
        const addElementToDocument = (key, value) => {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        };

        const imageZoomFeaturePresent = document.evaluate(
          'html//div[contains(@class, "sticky-gallery")]//div[contains(@class, "z-pdp__escape-grid")]//ul/li//img[contains(@style, "zoom-in")]',
          document,
          null,
          XPathResult.BOOLEAN_TYPE,
          null,
        ).booleanValue;
        addElementToDocument('variant_count', iterations);
        addElementToDocument('image_zoom_feature_present', imageZoomFeaturePresent);
      },
      { iterations },
    );
    await context.extract(productDetails, { transform });
  },
};
