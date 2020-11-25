const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    transform: cleanUp,
    domain: 'petshop.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    // Adding an empty list to the DOM
    await context.evaluate(async () => {
      const addedList = document.createElement('ol');
      addedList.id = 'variants_list';
      addedList.style.display = 'none';
      document.body.appendChild(addedList);
    });

    // Extracting product description
    const productDescription = await context.evaluate(async () => {
      const descriptionButton = document.evaluate('//button[div[text()="Описание"]]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      if (descriptionButton) {
        descriptionButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      return document.evaluate('//button[div[text()="Описание"]]/following-sibling::div[position()=1]//div[@name="active-tab"]', document, null, XPathResult.STRING_TYPE, null)
        .stringValue;
    });

    // Switching to the product's composition tab
    await context.evaluate(async () => {
      const compositionButton = document.evaluate('//button[div[text()="Состав"]]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      if (compositionButton) {
        compositionButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
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
        async ({ variantsTotal, productDescription }) => {
          const addedList = document.querySelector('ol#variants_list');
          const listElem = document.createElement('li');
          const variantElem = document.evaluate('//div[contains(@class, "art") and starts-with(text(), "Арт")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const variantId = variantElem && variantElem.match(/Арт(икул)?: (.+)/) ? variantElem.match(/Арт(икул)?: (.+)/)[2] : '';
          listElem.setAttribute('variant_id', variantId);

          const productScript = document.evaluate('//script[contains(text(), "/petshop/components/ps/product-head-")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          // eslint-disable-next-line no-useless-escape
          const productObjString =
            productScript && productScript.match(/window.__PS_STATE__\['\/petshop\/components\/ps\/product-head-.+? = (.+}]})/)
              ? productScript.match(/window.__PS_STATE__\['\/petshop\/components\/ps\/product-head-.+? = (.+}]})/)[1]
              : '{}';
          const productObj = JSON.parse(productObjString).product;

          const imagesList = document.createElement('ol');
          imagesList.id = 'images';
          const allImages = productObj && productObj.images ? productObj.images.filter((item) => item.type === 'image') : [];
          allImages.forEach((image) => {
            const imageElem = document.createElement('li');
            imageElem.setAttribute('src', `https:${image.bigImgSrc}`);
            imageElem.setAttribute('alt', image.alt);
            imagesList.appendChild(imageElem);
          });
          listElem.appendChild(imagesList);

          const videosList = document.createElement('ol');
          videosList.id = 'videos';
          const allVideos = productObj && productObj.images ? productObj.images.filter((item) => item.type === 'video' && item.youtubeCode) : [];
          allVideos.forEach((video) => {
            const videoElem = document.createElement('li');
            videoElem.setAttribute('src', `https://www.youtube.com/embed/${video.youtubeCode}`);
            videosList.appendChild(videoElem);
          });
          if (productObj.description.brandVideo) {
            const videoElem = document.createElement('li');
            videoElem.setAttribute('src', `https://www.youtube.com/embed/${productObj.description.brandVideo}`);
            videosList.appendChild(videoElem);
          }
          listElem.appendChild(videosList);

          const name = document.querySelector('div[class^="style_info_product_name"] h1') ? document.querySelector('div[class^="style_info_product_name"] h1').textContent : '';
          const brandElem = document.querySelector('a[class*="brand_name"], a[class*="ProductBrand"]');
          const brandName = brandElem ? brandElem.textContent : '';
          const brandLink = brandElem ? `https://www.petshop.ru${brandElem.getAttribute('href')}` : '';

          const listPrice = document.evaluate(
            'html//div[contains(@class, "style_price_wrapper")]/div/span/text()[contains(., "Обычная") or contains(., "со скидкой")]/ancestor::div[contains(@class, "style_price_wrapper")]//span[contains(@class, "style_price_old")]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const price = document.evaluate(
            'html//div[contains(@class, "style_price_wrapper")]/div/span/text()[contains(., "Обычная") or contains(., "со скидкой")]/ancestor::div[contains(@class, "style_price_wrapper")]//div[contains(@class, "style_price_current")]/span[@itemprop="priceCurrency"]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const availabilityText = document.evaluate('//div[@data-testid="deliveryInfo"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const couponText = document.querySelector('div.product-info div.flag') ? document.querySelector('div.product-info div.flag').textContent : '';

          listElem.setAttribute('product_name', name);
          listElem.setAttribute('brand', brandName);
          listElem.setAttribute('brand_link', brandLink);
          listElem.setAttribute('name_extended', [brandName, name, variantId].join(' - '));
          listElem.setAttribute('variant_count', variantsTotal);
          listElem.setAttribute('list_price', listPrice);
          listElem.setAttribute('price', price);
          listElem.setAttribute('availability_text', availabilityText);
          listElem.setAttribute('coupon_text', couponText);
          listElem.setAttribute('rating_count', productObj.rating.voteCount);
          listElem.setAttribute('aggregate_rating', productObj.rating.value);
          listElem.setAttribute('description', productDescription);

          const servingText = document.evaluate('//span[(contains(. , "Пищевая ценность") or contains(. , "Добавки") and contains(. , "г"))]', document, null, XPathResult.STRING_TYPE, null)
            .stringValue;
          const servingSize = servingText.match(/на (\d+) ?(к?г)/) ? servingText.match(/на (\d+) ?(к?г)/)[1] : '';
          const servingSizeUom = servingText.match(/на (\d+) ?(к?г)/) ? servingText.match(/на (\d+) ?(к?г)/)[2] : '';
          const caloriesText = document.evaluate('//div[b[contains(text(), "Энергетическая ценность") or contains(text(), "энергия")]]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          let caloriesPerServing = caloriesText.match(/г\)?: ([\d,]+)/) ? caloriesText.match(/г\)?: ([\d,]+)/)[1] : '';
          if (!caloriesPerServing) caloriesPerServing = caloriesText.match(/([\d,]+)\s[Кк]кал/) ? caloriesText.match(/([\d,]+)\s[Кк]кал/)[1] : '';

          listElem.setAttribute('serving_size', servingSize);
          listElem.setAttribute('serving_size_uom', servingSizeUom);
          listElem.setAttribute('calories_per_serving', caloriesPerServing);

          const fatText = document.evaluate('//tr[td[contains(. , "жир")] and contains(. , "г") and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const totalFatPerServing = fatText.match(/(\d+)\s?(.+)/) ? fatText.match(/(\d+)\s?(.+)/)[1] : '';
          const totalFatPerServingUom = fatText.match(/(\d+)\s?(.+)/) ? fatText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('total_fat_per_serving', totalFatPerServing);
          listElem.setAttribute('total_fat_per_serving_uom', totalFatPerServingUom);

          const sodiumText = document.evaluate('//tr[td[contains(. , "натрий")] and contains(. , "г") and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const sodiumPerServing = sodiumText.match(/(\d+)\s?(.+)/) ? sodiumText.match(/(\d+)\s?(.+)/)[1] : '';
          const sodiumPerServingUom = sodiumText.match(/(\d+)\s?(.+)/) ? sodiumText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('sodium_per_serving', sodiumPerServing);
          listElem.setAttribute('sodium_per_serving_uom', sodiumPerServingUom);

          const carbText = document.evaluate('//tr[td[contains(. , "углевод")] and contains(. , "г") and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const totalCarbPerServing = carbText.match(/(\d+)\s?(.+)/) ? carbText.match(/(\d+)\s?(.+)/)[1] : '';
          const totalCarbPerServingUom = carbText.match(/(\d+)\s?(.+)/) ? carbText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('total_carb_per_serving', totalCarbPerServing);
          listElem.setAttribute('total_carb_per_serving_uom', totalCarbPerServingUom);

          const fibreText = document.evaluate('//tr[td[contains(. , "волокно")] and contains(. , "г") and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const dietaryFibrePerServing = fibreText.match(/(\d+)\s?(.+)/) ? fibreText.match(/(\d+)\s?(.+)/)[1] : '';
          const dietaryFibrePerServingUom = fibreText.match(/(\d+)\s?(.+)/) ? fibreText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('dietary_fibre_per_serving', dietaryFibrePerServing);
          listElem.setAttribute('dietary_fibre_per_serving_uom', dietaryFibrePerServingUom);

          const sugarText = document.evaluate('//tr[td[contains(. , "сахар")] and contains(. , "г") and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const totalSugarsPerServing = sugarText.match(/(\d+)\s?(.+)/) ? sugarText.match(/(\d+)\s?(.+)/)[1] : '';
          const totalSugarsPerServingUom = sugarText.match(/(\d+)\s?(.+)/) ? sugarText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('total_sugar_per_serving', totalSugarsPerServing);
          listElem.setAttribute('total_sugar_per_serving_uom', totalSugarsPerServingUom);

          const proteinText = document.evaluate(
            '//tr[td[contains(. , "белок") or contains(. , "белки")] and contains(. , "г") and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const proteinPerServing = proteinText.match(/(\d+)\s?(.+)/) ? proteinText.match(/(\d+)\s?(.+)/)[1] : '';
          const proteinPerServingUom = proteinText.match(/(\d+)\s?(.+)/) ? proteinText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('protein_per_serving', proteinPerServing);
          listElem.setAttribute('protein_per_serving_uom', proteinPerServingUom);

          const vitaminAText = document.evaluate('//tr[td[contains(. , "витамин А")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const vitaminAPerServing = vitaminAText.match(/(\d+)\s?(.+)/) ? vitaminAText.match(/(\d+)\s?(.+)/)[1] : '';
          const vitaminAPerServingUom = vitaminAText.match(/(\d+)\s?(.+)/) ? vitaminAText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('vitamin_a_per_serving', vitaminAPerServing);
          listElem.setAttribute('vitamin_a_per_serving_uom', vitaminAPerServingUom);

          const vitaminCText = document.evaluate('//tr[td[contains(. , "витамин C")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const vitaminCPerServing = vitaminCText.match(/(\d+)\s?(.+)/) ? vitaminCText.match(/(\d+)\s?(.+)/)[1] : '';
          const vitaminCPerServingUom = vitaminCText.match(/(\d+)\s?(.+)/) ? vitaminCText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('vitamin_c_per_serving', vitaminCPerServing);
          listElem.setAttribute('vitamin_c_per_serving_uom', vitaminCPerServingUom);

          const calciumText = document.evaluate('//tr[td[contains(. , "кальций")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const calciumPerServing = calciumText.match(/(\d+)\s?(.+)/) ? calciumText.match(/(\d+)\s?(.+)/)[1] : '';
          const calciumPerServingUom = calciumText.match(/(\d+)\s?(.+)/) ? calciumText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('calcium_per_serving', calciumPerServing);
          listElem.setAttribute('calcium_per_serving_uom', calciumPerServingUom);

          const ironText = document.evaluate('//tr[td[contains(. , "железо")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const ironPerServing = ironText.match(/(\d+)\s?(.+)/) ? ironText.match(/(\d+)\s?(.+)/)[1] : '';
          const ironPerServingUom = ironText.match(/(\d+)\s?(.+)/) ? ironText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('iron_per_serving', ironPerServing);
          listElem.setAttribute('iron_per_serving_uom', ironPerServingUom);

          const magnesiumText = document.evaluate('//tr[td[contains(. , "магний")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const magnesiumPerServing = magnesiumText.match(/(\d+)\s?(.+)/) ? magnesiumText.match(/(\d+)\s?(.+)/)[1] : '';
          const magnesiumPerServingUom = magnesiumText.match(/(\d+)\s?(.+)/) ? magnesiumText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('magnesium_per_serving', magnesiumPerServing);
          listElem.setAttribute('magnesium_per_serving_uom', magnesiumPerServingUom);

          const saltText = document.evaluate('//tr[td[contains(. , "соль")] and not(contains(. , "%"))]', document, null, XPathResult.STRING_TYPE, null).stringValue;
          const saltPerServing = saltText.match(/(\d+)\s?(.+)/) ? saltText.match(/(\d+)\s?(.+)/)[1] : '';
          const saltPerServingUom = saltText.match(/(\d+)\s?(.+)/) ? saltText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('salt_per_serving', saltPerServing);
          listElem.setAttribute('salt_per_serving_uom', saltPerServingUom);

          const image360Present = !!productObj.images.find(item => item.type === '3d' && item.imagesArr.length);
          listElem.setAttribute('image_360_present', image360Present.toString());

          addedList.appendChild(listElem);
        },
        { variantsTotal, productDescription },
      );
    }
    await context.extract(productDetails, { transform });
  },
};
