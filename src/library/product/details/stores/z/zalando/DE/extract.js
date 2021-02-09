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
    // checking for selected language and changing to German if required
    const englishSelected = await context.evaluate(async () => !!document.querySelector('a[title="Choose language"]'));
    if (englishSelected) {
      console.log('Changing language');
      await context.click('a[title="Choose language"]');
      await context.waitForSelector('div.z-navicat-header_modalContent', { timeout: 10000 });
      const changingLanguage = await context.evaluate(async () => {
        const deutschLabel = document.evaluate(
          '//label[@class="z-navicat-header_radioItem"][contains(. , "Deutsch")]',
          document,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        if (deutschLabel) {
          deutschLabel.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return !!document.querySelector('div.z-navicat-header_modalContent button[class*="Primary"]');
        }
      });
      if (changingLanguage) {
        await context.click('div.z-navicat-header_modalContent button[class*="Primary"]');
        await context.waitForNavigation({ timeout: 30000, waitUntil: 'load' });
      }
      console.log('Finished changing language');
    }

    const numOfThumbnails = await context.evaluate(async () => {
      const alternateImagesList = document.createElement('ol');
      alternateImagesList.id = 'added_alternate_images';
      alternateImagesList.style.display = 'none';
      document.body.appendChild(alternateImagesList);
      const totalThumbnails = document.querySelectorAll('div[class*="sticky-gallery"] ul button').length;
      alternateImagesList.setAttribute('secondary_image_total', (totalThumbnails - 1).toString());
      return totalThumbnails;
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const inStock = await context.evaluate(async () => {
        const closeButton = document.querySelector(
          'div[role="modal"][style="z-index: 100005;"] button svg > title[id^="cross"]',
        );
        const inStock = !document.evaluate(
          '//div[@role="modal" and @style="z-index: 100005;"]//h2[text() = "Ausverkauft"]',
          document,
          null,
          XPathResult.BOOLEAN_TYPE,
          null,
        ).booleanValue;
        if (closeButton) {
          closeButton.parentElement.parentElement.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
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

          const nameExtended = productName.toLowerCase().includes(brand.toLowerCase())
            ? [productName]
            : [brand, productName];

          const size =
            variantElement && variantElement.querySelector('label > span span')
              ? variantElement.querySelector('label > span span').textContent.trim()
              : '';
          if (size) nameExtended.push(size);

          let colorName = document.querySelector('x-wrapper-re-1-3 > div:last-child span:last-child')
            ? document.querySelector('x-wrapper-re-1-3 > div:last-child span:last-child').textContent
            : '';
          if (!colorName) {
            colorName = document
              .evaluate(
                '//div[span[contains(text(), "Farbe")]]//button[contains(@aria-labelledby, "farbe")]//span',
                document,
                null,
                XPathResult.STRING_TYPE,
                null,
              )
              .stringValue.trim();
          }
          if (colorName) {
            addedVariant.setAttribute('variant_information', colorName);
            nameExtended.push(colorName);
          }

          const outOfStockText = document.evaluate(
            '//x-wrapper-re-1-5//h2[text()="Ausverkauft"]',
            document,
            null,
            XPathResult.BOOLEAN_TYPE,
            null,
          ).booleanValue;
          const availabilityText = inStock && !outOfStockText ? 'In Stock' : 'Out Of Stock';
          let currentVariantId;

          if (variantElement) {
            const productCode = variantElement.querySelector('input').value;
            currentVariantId = productCode;

            const firstVariantElem = document.querySelector(
              'form[name="size-picker-form"] div[role="presentation"]:nth-of-type(1) > input',
            );
            const firstVariantValue = firstVariantElem.getAttribute('value');
            if (firstVariantValue) addedVariant.setAttribute('first_variant', firstVariantValue);

            const variantsList = document.createElement('ol');
            variantsList.id = 'variants';
            const totalVariants = document.querySelectorAll(
              'form[name="size-picker-form"] div[role="presentation"] > input',
            );
            for (let j = 0; j < totalVariants.length; j++) {
              const variantId = totalVariants[j].getAttribute('value');
              if (variantId !== currentVariantId) {
                const listItem = document.createElement('li');
                listItem.textContent = variantId;
                variantsList.appendChild(listItem);
              }
            }
            addedVariant.appendChild(variantsList);
          }

          if (inStock) {
            const priceRow = document.querySelector('x-wrapper-re-1-3 > div > div');
            const priceElements = document.evaluate(
              './/span[text() and not(contains(text(), "inkl"))]',
              priceRow,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null,
            );
            const price = priceElements.snapshotItem(0) ? priceElements.snapshotItem(0).textContent : '';
            const listPrice = priceElements.snapshotItem(1) ? priceElements.snapshotItem(1).textContent : '';

            addedVariant.setAttribute('price', price);
            addedVariant.setAttribute('list_price', listPrice);
          }

          addedVariant.setAttribute('availability_text', availabilityText);
          addedVariant.setAttribute('name_extended', nameExtended.join(' '));

          const extraDataScript = document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]')
            ? document.querySelector('x-wrapper-pdp > div > script[id="z-vegas-pdp-props"]').textContent
            : '';
          const extraDataObj = JSON.parse(extraDataScript.substr(9, extraDataScript.length - 12));

          if (extraDataScript && extraDataObj) {
            if (!currentVariantId) {
              currentVariantId =
                extraDataObj.model && extraDataObj.model.articleInfo && extraDataObj.model.articleInfo.units[0]
                  ? extraDataObj.model.articleInfo.units[0].id
                  : '';
              // currentVariantId = extraDataObj.model?.articleInfo?.units[0]?.id;
            }
            const ratingCount = extraDataObj.model.articleInfo.reviewsCount;
            let aggregateRating = extraDataObj.model.articleInfo.averageStarRating;
            if (aggregateRating) aggregateRating = (Math.round(aggregateRating * 10) / 10).toString().replace('.', ',');
            addedVariant.setAttribute('rating_count', ratingCount);
            addedVariant.setAttribute('aggregate_rating', aggregateRating);

            const mpc =
              extraDataObj.model && extraDataObj.model.articleInfo && extraDataObj.model.articleInfo.modelId
                ? extraDataObj.model.articleInfo.modelId
                : '';
            addedVariant.setAttribute('mpc', mpc);
          }

          addedVariant.setAttribute('variant_id', currentVariantId);

          let sku = document.evaluate(
            '//div[@class="z-pdp__escape-grid"]//div[h2]/div[contains(@style, "max-height")]/div/div/span[text()="Artikelnummer"]/following-sibling::span',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;

          if (!sku) {
            const skuMatch = currentVariantId.match(/(^\w{9}-\w{3})/);
            sku = skuMatch ? skuMatch[1] : '';
          }
          addedVariant.setAttribute('sku', sku);

          const promotion = document.evaluate(
            '//x-wrapper-re-1-3/h1/following-sibling::div/div/preceding-sibling::span',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          addedVariant.setAttribute('promotion', promotion);

          const descriptionSnapthot = document.evaluate(
            '//div[@class="z-pdp__escape-grid"]//div[h2[not(contains(. , "Passform") or contains(. , "Nachhaltigkeit"))]]/div[contains(@style, "max-height")]/div/div[not(button)]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          );
          const descriptionArr = [];
          for (let j = 0; j < descriptionSnapthot.snapshotLength; j++) {
            const elem = descriptionSnapthot.snapshotItem(j);
            descriptionArr.push(elem.textContent);
          }
          addedVariant.setAttribute('description', descriptionArr.join(' | '));

          const directions = document.evaluate(
            '//div[@class="z-pdp__escape-grid"]//button//span[contains(text(), "Highlights")]/ancestor::h2/following-sibling::div//*[contains(. , "Empfohlene Anwendung")]/following-sibling::div[position() = 1]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          document.body.setAttribute('directions', directions);

          const ingredients = document.evaluate(
            '//div[@class="z-pdp__escape-grid"]//button//span[contains(text(), "Inhaltsstoffe")]/ancestor::h2/following-sibling::div//span[contains(. , "Inhaltsstoffe")]/following-sibling::span[position() = 1]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          document.body.setAttribute('ingredients', ingredients);

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

        const productUrl = window.location.href.match(/(.+html)/)
          ? window.location.href.match(/(.+html)/)[1]
          : window.location.href;
        addElementToDocument('product_url', productUrl);
        addElementToDocument('variant_count', iterations);
        addElementToDocument('image_zoom_feature_present', imageZoomFeaturePresent);
      },
      { iterations },
    );
    await context.extract(productDetails, { transform });
  },
};
