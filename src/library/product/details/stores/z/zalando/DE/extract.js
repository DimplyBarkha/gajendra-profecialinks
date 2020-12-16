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
      const alternateImagesList = document.createElement('ol');
      alternateImagesList.id = 'added_alternate_images';
      alternateImagesList.style.display = 'none';
      document.body.appendChild(alternateImagesList);
      return document.querySelectorAll('div[class*="sticky-gallery"] ul button').length;
    });
    for (let i = 1; i <= numOfThumbnails; i++) {
      await context.click(`div[class*="sticky-gallery"] ul > li:nth-of-type(${i}) button`);
      await context.evaluate(async (i) => {
        const alternateImagesList = document.querySelector('ol#added_alternate_images');
        const img = document.querySelector(`div[class*="sticky-gallery"] ul > li:nth-of-type(${i}) button img`);
        const imgSrc = img && img.getAttribute('src').match(/^.+jpg/) ? img.getAttribute('src').match(/^.+jpg/)[0] : '';
        if (imgSrc) {
          const listItem = document.createElement('li');
          listItem.textContent = imgSrc;
          alternateImagesList.appendChild(listItem);
        }
      }, i);
    }

    await context.click('x-wrapper-re-1-5 button[id="picker-trigger"]');
    const numOfVariants = await context.evaluate(
      async () => document.querySelectorAll('form[name="size-picker-form"] div[role="presentation"] label').length,
    );
    const iterations = numOfVariants || 1;
    for (let i = 1; i <= iterations; i++) {
      if (numOfVariants) {
        await context.click(`form[name="size-picker-form"] div[role="presentation"]:nth-of-type(${i}) label`);
      }

      const inStock = await context.evaluate(async () => {
        const closeButton = document.querySelector(
          'div[role="modal"][style="z-index: 100005;"] button svg > title[id^="cross"]',
        );
        const inStock = !document.evaluate(
          '//div[@role="modal" and @style="z-index: 100005;"]//h2[text() = "Out of stock"]',
          document,
          null,
          XPathResult.BOOLEAN_TYPE,
          null,
        ).booleanValue;
        if (closeButton) {
          closeButton.parentElement.parentElement.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return inStock;
      });

      await context.evaluate(
        async ({ i, inStock }) => {
          const addedVariant = document.createElement('div');
          addedVariant.id = `added_variant${i}`;
          addedVariant.style.display = 'none';
          const variantElement = document.querySelector(
            `form[name="size-picker-form"] div[role="presentation"]:nth-of-type(${i})`,
          );

          const brand = document.querySelector('x-wrapper-re-1-3 h3')
            ? document.querySelector('x-wrapper-re-1-3 h3').textContent.trim()
            : '';
          const productName = document.querySelector('x-wrapper-re-1-3 > h1')
            ? document.querySelector('x-wrapper-re-1-3 > h1').textContent.trim()
            : '';
          const nameExtended = [brand, productName];
          // const colorName = document.querySelector('x-wrapper-re-1-3 > div:last-child span:last-child')
          //   ? document.querySelector('x-wrapper-re-1-3 > div:last-child span:last-child').textContent
          //   : '';
          // if (colorName) {
          //   addedVariant.setAttribute('variant_information', colorName);
          //   nameExtended.push(colorName);
          // }

          const outOfStockText = document.evaluate(
            '//x-wrapper-re-1-5//h2[text()="Out of stock"]',
            document,
            null,
            XPathResult.BOOLEAN_TYPE,
            null,
          ).booleanValue;
          let availabilityText = inStock && !outOfStockText ? 'In stock' : 'Out of stock';

          if (variantElement) {
            const sku = document.evaluate(
              '//div[@class="z-pdp__escape-grid"]//button//span[text()="Details" or text()="Highlights"]/ancestor::h2/following-sibling::div//span[text()="Article number"]/following-sibling::span',
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            ).stringValue;
            const productCode = variantElement.querySelector('input').value;
            const currentVariantId = productCode.replace(sku, '');
            addedVariant.setAttribute('variant_id', currentVariantId);

            const firstVariantElem = document.querySelector(
              'form[name="size-picker-form"] div[role="presentation"]:nth-of-type(1) > input',
            );
            const firstVariantValue = firstVariantElem.getAttribute('value');
            if (firstVariantValue) addedVariant.setAttribute('first_variant', firstVariantValue.replace(sku, ''));

            // const variantName = variantElement.querySelector('span > div > span:nth-of-type(1)')
            //   ? variantElement.querySelector('span > div > span:nth-of-type(1)').textContent
            //   : '';
            // if (variantName) nameExtended.push(variantName);

            if (inStock) {
              const priceRow = document.querySelector('x-wrapper-re-1-3 > div > div');
              const priceElements = document.evaluate(
                './/span[text() and not(contains(text(), "VAT"))]',
                priceRow,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
              );
              const price = priceElements.snapshotItem(0) ? priceElements.snapshotItem(0).textContent : '';
              const listPrice = priceElements.snapshotItem(1) ? priceElements.snapshotItem(1).textContent : '';

              addedVariant.setAttribute('price', price);
              addedVariant.setAttribute('list_price', listPrice);

              const availabilityElem = variantElement.querySelector('label > div');
              if (availabilityElem && availabilityElem.textContent) availabilityText = availabilityElem.textContent;

              const variantsList = document.createElement('ol');
              variantsList.id = 'variants';
              const totalVariants = document.querySelectorAll(
                'form[name="size-picker-form"] div[role="presentation"] > input',
              );
              for (let j = 0; j < totalVariants.length; j++) {
                const variantId = totalVariants[j].getAttribute('value').replace(sku, '');
                if (variantId !== currentVariantId) {
                  const listItem = document.createElement('li');
                  listItem.textContent = variantId;
                  variantsList.appendChild(listItem);
                }
              }
              addedVariant.appendChild(variantsList);
            }
          }

          addedVariant.setAttribute('availability_text', availabilityText);
          addedVariant.setAttribute('name_extended', nameExtended.join(' - '));

          const extraDataScript = document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]')
            ? document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]').textContent
            : '';
          const extraDataObj = JSON.parse(extraDataScript.substr(9, extraDataScript.length - 12));

          if (extraDataScript && extraDataObj) {
            const ratingCount = extraDataObj.model.articleInfo.reviewsCount;
            let aggregateRating = extraDataObj.model.articleInfo.averageStarRating;
            if (aggregateRating) aggregateRating = (Math.round(aggregateRating * 10) / 10).toString().replace('.', ',');
            addedVariant.setAttribute('rating_count', ratingCount);
            addedVariant.setAttribute('aggregate_rating', aggregateRating);
          }

          document.body.appendChild(addedVariant);
        },
        { i, inStock },
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

        addElementToDocument('product_url', window.location.href);
        addElementToDocument('variant_count', iterations);
        addElementToDocument('image_zoom_feature_present', imageZoomFeaturePresent);
      },
      { iterations },
    );
    await context.extract(productDetails, { transform });
  },
};
