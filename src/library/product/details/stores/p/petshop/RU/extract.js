// @ts-nocheck
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
      const getDescription = () => {
        const digForText = (parent, descriptionArr) => {
          for (let i = 0; i < parent.childNodes.length; i++) {
            const child = parent.childNodes[i];
            if (child.nodeType === 3) descriptionArr.push(child.textContent.trim());
            else if (child.nodeName === 'TABLE') break;
            else digForText(child, descriptionArr);
          }
        };

        const descriptionArr = [];
        const descriptionParent = document.evaluate(
          '//button[div[text()="Описание"]]/following-sibling::div[position()=1]//div[@name="active-tab"]//div[@data-testid="ProductDescription__content"]/div[contains(@class, "style_text")]/div/div',
          document,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;

        if (descriptionParent) digForText(descriptionParent, descriptionArr);
        const alternateDescription = document.querySelector('div#product-detail-text')
          ? document.querySelector('div#product-detail-text').textContent
          : '';

        const description = descriptionArr
          .filter((item) => !!item)
          .join(' ')
          .replace(/\n+/g, ' ');

        return description || alternateDescription;
      };

      const descriptionButton = document.evaluate(
        '//button[div[text()="Описание"]]',
        document,
        null,
        XPathResult.ANY_UNORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (descriptionButton) {
        descriptionButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const directions = document
        .evaluate(
          '(//button[div[text()="Описание"]]/following-sibling::div[position()=1]//div[@name="active-tab"]//table)[1]',
          document,
          null,
          XPathResult.STRING_TYPE,
          null,
        )
        .stringValue.trim();

      document.body.setAttribute('directions', directions);

      return getDescription();
    });

    // adding manufacturer images
    await context.evaluate(async => {
      const allImages = document.querySelectorAll('div[data-testid="ProductDescription__content"] img');
      const imagesList = document.createElement('ol');
      imagesList.id = 'manufacturer_images';
      imagesList.style.display = 'none';
      document.body.appendChild(imagesList);
      for (let i = 0; i < allImages.length; i++) {
        const image = allImages[i];
        const listItem = document.createElement('li');
        listItem.setAttribute('src', image.src);
        imagesList.appendChild(listItem);
      }
    });

    // Switching to the product's composition tab
    await context.evaluate(async () => {
      const compositionButton = document.evaluate(
        '//button[div[text()="Состав"]]',
        document,
        null,
        XPathResult.ANY_UNORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (compositionButton) {
        compositionButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    });

    const variantsTotal = await context.evaluate(
      async () => document.querySelectorAll('div[class^="style_info"] div[class^="style_tile_wrapper"] > label').length,
    );
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
          const digForText = (parent, descriptionArr) => {
            for (let i = 0; i < parent.childNodes.length; i++) {
              const child = parent.childNodes[i];
              if (child.nodeType === 3) descriptionArr.push(child.textContent.trim());
              else if (child.nodeName === 'TABLE') break;
              else digForText(child, descriptionArr);
            }
          };

          const addedList = document.querySelector('ol#variants_list');
          const listElem = document.createElement('li');
          const variantElem = document.evaluate(
            '//div[contains(@class, "art") and starts-with(text(), "Арт")]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const variantId =
            variantElem && variantElem.match(/Арт(икул)?: (.+)/) ? variantElem.match(/Арт(икул)?: (.+)/)[2] : '';
          listElem.setAttribute('variant_id', variantId);

          const productScript = document.evaluate(
            '//script[contains(text(), "/petshop/components/ps/product-head-")]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          // eslint-disable-next-line no-useless-escape
          const productObjRegexp = /window.__PS_STATE__\['\/petshop\/components\/ps\/product-head-.+? = (.+}]})/;
          const productObjString =
            productScript && productScript.match(productObjRegexp) ? productScript.match(productObjRegexp)[1] : '{}';
          const productObj = JSON.parse(productObjString).product;

          const skuScript = document.evaluate(
            '//section[contains(@class, "style_product_head")]/script',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const sku = skuScript.match(/"sku":"(.+?)"/) ? skuScript.match(/"sku":"(.+?)"/)[1] : '';
          const mpc = skuScript.match(/"mpn":"(.+?)"/) ? skuScript.match(/"mpn":"(.+?)"/)[1] : '';
          listElem.setAttribute('added_sku', sku);
          listElem.setAttribute('added_mpc', mpc);

          const imagesList = document.createElement('ol');
          imagesList.id = 'images';
          const allImages =
            productObj && productObj.images ? productObj.images.filter((item) => item.type === 'image') : [];
          allImages.forEach((image) => {
            const imageElem = document.createElement('li');
            imageElem.setAttribute('src', `https:${image.defaultImgSrc}`);
            imageElem.setAttribute('alt', image.alt);
            imagesList.appendChild(imageElem);
          });
          imagesList.setAttribute('total', allImages.length - 1);
          listElem.appendChild(imagesList);

          const videosList = document.createElement('ol');
          videosList.id = 'videos';
          const allVideos =
            productObj && productObj.images
              ? productObj.images.filter((item) => item.type === 'video' && item.youtubeCode)
              : [];
          allVideos.forEach((video) => {
            const videoElem = document.createElement('li');
            videoElem.setAttribute('src', `https://www.youtube.com/embed/${video.youtubeCode}`);
            videosList.appendChild(videoElem);
          });
          if (productObj && productObj.description && productObj.description.brandVideo) {
            const videoElem = document.createElement('li');
            videoElem.setAttribute('src', `https://www.youtube.com/embed/${productObj.description.brandVideo}`);
            videosList.appendChild(videoElem);
          }
          listElem.appendChild(videosList);

          const productUrl = window.location.href;
          const name = document.querySelector('div[class^="style_info_product_name"] h1, h1.product-name')
            ? document.querySelector('div[class^="style_info_product_name"] h1, h1.product-name').innerText
            : '';
          const brandElem = document.querySelector('a[class*="brand_name"], a[class*="ProductBrand"]');
          const brandName = brandElem ? brandElem.innerText.trim() : '';
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

          const availabilityText = document.querySelector('div[data-testid="deliveryInfo"][class*="not_available"]')
            ? 'Out of Stock'
            : 'In Stock';

          const couponText = document.querySelector('div.product-info div.flag')
            ? document.querySelector('div.product-info div.flag').textContent
            : '';
          const nameExtended =
            brandName && !name.toLowerCase().includes(brandName.toLowerCase()) ? `${brandName} - ${name}` : name;

          listElem.setAttribute('product_url', productUrl);
          listElem.setAttribute('product_name', name);
          listElem.setAttribute('brand', brandName);
          listElem.setAttribute('brand_link', brandLink);
          listElem.setAttribute('name_extended', nameExtended.replace(/\n+/g, ' '));
          listElem.setAttribute('variant_count', variantsTotal);
          listElem.setAttribute('list_price', listPrice);
          listElem.setAttribute('price', price);
          listElem.setAttribute('availability_text', availabilityText);
          listElem.setAttribute('coupon_text', couponText);
          listElem.setAttribute('description', productDescription);
          if (productObj && productObj.rating) {
            listElem.setAttribute('rating_count', productObj.rating.voteCount);
            listElem.setAttribute('aggregate_rating', productObj.rating.value.toString().replace('.', ','));
          } else {
            const ratingText = document.querySelector('div[class^="rating-level rating-level"]')
              ? document.querySelector('div[class^="rating-level rating-level"]').getAttribute('class')
              : '';
            const ratingMatch = ratingText.match(/(\d)(\d).*$/);
            if (ratingMatch) listElem.setAttribute('aggregate_rating', `${ratingMatch[1]},${ratingMatch[2]}`);

            const ratingCountText = document.querySelector('div.rating-caption')
              ? document.querySelector('div.rating-caption').textContent
              : '';
            const ratingCountMatch = ratingCountText.match(/^.*?(\d+)/);
            if (ratingCountMatch) listElem.setAttribute('rating_count', ratingCountMatch[1]);
          }

          const compositionText = document.evaluate(
            '//div[@data-testid="ProductComposition__title"]/following-sibling::div[1]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;

          const servingText = document.evaluate(
            '//span[(contains(. , "Пищевая ценность") or contains(. , "Добавки") and contains(. , "г"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const servingSize = servingText.match(/на (\d+) ?(к?г)/) ? servingText.match(/на (\d+) ?(к?г)/)[1] : '';
          const servingSizeUom = servingText.match(/на (\d+) ?(к?г)/) ? servingText.match(/на (\d+) ?(к?г)/)[2] : '';
          const caloriesText = document.evaluate(
            '//div[b[contains(text(), "Энергетическая ценность") or contains(text(), "энергия")]]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          let caloriesPerServing = caloriesText.match(/г\)?: ([\d,]+)/) ? caloriesText.match(/г\)?: ([\d,]+)/)[1] : '';
          if (!caloriesPerServing) {
            caloriesPerServing = caloriesText.match(/([\d,]+)\s[Кк]кал/)
              ? caloriesText.match(/([\d,]+)\s[Кк]кал/)[1]
              : '';
          }

          listElem.setAttribute('serving_size', servingSize);
          listElem.setAttribute('serving_size_uom', servingSizeUom);
          listElem.setAttribute('calories_per_serving', caloriesPerServing);

          const fatMatch = compositionText.match(/жир(\s–|:|\s-)?\s?([\d.,]+)(.+?)[;,]/i);
          let totalFatPerServing = fatMatch ? fatMatch[2] : '';
          let totalFatPerServingUom = fatMatch ? fatMatch[3] : '';

          if (!totalFatPerServing) {
            let fatElem;
            const fatSnapshot = document.evaluate(
              '//*[(name()="tr" or name()="li") and contains(translate(. , "ЖИР", "жир"), "жир")]',
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null,
            );
            for (let i = 0; i < fatSnapshot.snapshotLength; i++) {
              const elem = fatSnapshot.snapshotItem(i);
              const elemText = elem.textContent.toLowerCase().trim();
              if (elemText.startsWith('жир') || elemText.match(/жиры?[\s,:]/)) {
                fatElem = elem;
                break;
              }
            }
            if (!fatElem) fatElem = fatSnapshot.snapshotItem(fatSnapshot.snapshotLength - 1);
            const fatText = fatElem ? fatElem.textContent : '';

            const fatRegexp = /((\d+)([.,]\d+)?)\s?(.+)?/;
            totalFatPerServing = fatText.match(fatRegexp) ? fatText.match(fatRegexp)[1] : '';
            totalFatPerServingUom =
              fatText.match(fatRegexp) && fatText.match(fatRegexp)[4]
                ? fatText.match(fatRegexp)[4].replace(',', '')
                : '';
            if (!totalFatPerServingUom && fatText.includes('%')) totalFatPerServingUom = '%';
          }

          listElem.setAttribute('total_fat_per_serving', totalFatPerServing);
          listElem.setAttribute('total_fat_per_serving_uom', totalFatPerServingUom);

          const sodiumText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "НАТРИЙ", "натрий"), "натрий")]',
            // '//tr[td[contains(. , "натрий")] and contains(. , "г") and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const sodiumRegexp = /((\d+)([.,]\d+)?)\s?(.+)?/;
          const sodiumPerServing = sodiumText.match(sodiumRegexp) ? sodiumText.match(sodiumRegexp)[1] : '';
          const sodiumPerServingUom = sodiumText.match(sodiumRegexp) ? sodiumText.match(sodiumRegexp)[4] : '';

          listElem.setAttribute('sodium_per_serving', sodiumPerServing);
          listElem.setAttribute('sodium_per_serving_uom', sodiumPerServingUom);

          const carbText = document.evaluate(
            '//tr[td[contains(. , "углевод")] and contains(. , "г") and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const totalCarbPerServing = carbText.match(/(\d+)\s?(.+)/) ? carbText.match(/(\d+)\s?(.+)/)[1] : '';
          const totalCarbPerServingUom = carbText.match(/(\d+)\s?(.+)/) ? carbText.match(/(\d+)\s?(.+)/)[2] : '';

          listElem.setAttribute('total_carb_per_serving', totalCarbPerServing);
          listElem.setAttribute('total_carb_per_serving_uom', totalCarbPerServingUom);

          const fibreMatch = compositionText.match(/клетчатка(\s–|:|\s-)?\s?([\d.,]+)(.+?)[;,]/i);
          let dietaryFibrePerServing = fibreMatch ? fibreMatch[2] : '';
          let dietaryFibrePerServingUom = fibreMatch ? fibreMatch[3] : '';

          if (!dietaryFibrePerServing) {
            const fibreText = document.evaluate(
              '//*[(name()="tr" or name()="li") and (contains(translate(. , "КЛЕТЧАТКА", "клетчатка"), "клетчатка") or contains(translate(. , "ВОЛОКНО", "волокно"), "волокно"))]',
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            ).stringValue;
            const fibreRegexp = /((\d+)([.,]\d+)?)\s?(.+)?/;
            dietaryFibrePerServing = fibreText.match(fibreRegexp) ? fibreText.match(fibreRegexp)[1] : '';
            dietaryFibrePerServingUom = fibreText.match(fibreRegexp) ? fibreText.match(fibreRegexp)[4] : '';
          }

          listElem.setAttribute('dietary_fibre_per_serving', dietaryFibrePerServing);
          listElem.setAttribute('dietary_fibre_per_serving_uom', dietaryFibrePerServingUom);

          const sugarText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "САХАР", "сахар"), "сахар")]',
            // '//tr[td[contains(. , "сахар")] and contains(. , "г") and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const sugarMatch = sugarText.match(/((\d+)([.,]\d+)?)\s?(.+)?/);
          const totalSugarsPerServing = sugarMatch ? sugarMatch[1] : '';
          const totalSugarsPerServingUom = sugarMatch ? sugarMatch[4] : '';

          listElem.setAttribute('total_sugar_per_serving', totalSugarsPerServing);
          listElem.setAttribute('total_sugar_per_serving_uom', totalSugarsPerServingUom);

          const proteinMatch = compositionText.match(/бело?ки?(\s–|:|\s-)?\s?([\d.,]+)(.+?)[;,]/i);
          let proteinPerServing = proteinMatch ? proteinMatch[2] : '';
          let proteinPerServingUom = proteinMatch ? proteinMatch[3] : '';

          if (!proteinPerServing) {
            const proteinText = document.evaluate(
              '(//*[(name()="tr" or name()="li") and (contains(translate(. , "БЕЛОК", "белок"), "белок") or contains(translate(. , "БЕЛКИ", "белки"), "белки"))])[last()]',
              // '//tr[td[contains(. , "белок") or contains(. , "белки")] and contains(. , "г") and not(contains(. , "%"))]',
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            ).stringValue;
            const proteinRegExp = /((\d+)([.,]\d+)?)\s?(.+)?/;
            proteinPerServing = proteinText.match(proteinRegExp) ? proteinText.match(proteinRegExp)[1] : '';
            proteinPerServingUom = proteinText.match(proteinRegExp) ? proteinText.match(proteinRegExp)[4] : '';
          }

          listElem.setAttribute('protein_per_serving', proteinPerServing);
          listElem.setAttribute('protein_per_serving_uom', proteinPerServingUom);

          let vitaminAMatch = compositionText.match(/(МЕ\/кг):\sвитамин [АA]:?\s?([\d,.]+)/i);
          let vitaminAPerServing = vitaminAMatch ? vitaminAMatch[2] : '';
          let vitaminAPerServingUom = vitaminAMatch ? vitaminAMatch[1] : '';

          if (!vitaminAPerServing) {
            vitaminAMatch = compositionText.match(/витамин [АA](\s–|:|\s-)?( не менее)?\s?([\d.,]+)(.+?)[;,:]/i);
            vitaminAPerServing = vitaminAMatch ? vitaminAMatch[3] : '';
            vitaminAPerServingUom = vitaminAMatch ? vitaminAMatch[4] : '';
          }

          if (!vitaminAPerServing) {
            const vitaminAText = document.evaluate(
              '(//*[(name()="tr" or name()="li") and contains(translate(. , "ВИТАМИН A", "витамин a"), "витамин а")])[last()]',
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            ).stringValue;
            const vitaminARegExp = /((\d+)([.,]\d+)?)\s?(.+)?/;
            vitaminAPerServing = vitaminAText.match(vitaminARegExp) ? vitaminAText.match(vitaminARegExp)[1] : '';
            vitaminAPerServingUom = vitaminAText.match(vitaminARegExp) ? vitaminAText.match(vitaminARegExp)[4] : '';
          }

          listElem.setAttribute('vitamin_a_per_serving', vitaminAPerServing);
          listElem.setAttribute('vitamin_a_per_serving_uom', vitaminAPerServingUom);

          const vitaminCText = document.evaluate(
            '(//*[(name()="tr" or name()="li") and contains(translate(. , "ВИТАМИН С", "витамин с"), "витамин с")])[last()]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const vitaminCRegExp = /((\d+)([.,]\d+)?)\s?(.+)?/;
          const vitaminCPerServing = vitaminCText.match(vitaminCRegExp) ? vitaminCText.match(vitaminCRegExp)[1] : '';
          const vitaminCPerServingUom = vitaminCText.match(vitaminCRegExp) ? vitaminCText.match(vitaminCRegExp)[4] : '';

          listElem.setAttribute('vitamin_c_per_serving', vitaminCPerServing);
          listElem.setAttribute('vitamin_c_per_serving_uom', vitaminCPerServingUom);

          const calciumText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "КАЛЬЦИЙ", "кальций"), "кальций")]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const calciumRegexp = /([\d.,]+)\s?(.+)/;
          const calciumPerServing = calciumText.match(calciumRegexp) ? calciumText.match(calciumRegexp)[1] : '';
          const calciumPerServingUom = calciumText.match(calciumRegexp) ? calciumText.match(calciumRegexp)[2] : '';

          listElem.setAttribute('calcium_per_serving', calciumPerServing);
          listElem.setAttribute('calcium_per_serving_uom', calciumPerServingUom);

          const ironText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "ЖЕЛЕЗО", "железо"), "железо")]',
            // '//tr[td[contains(. , "железо")] and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const ironRegexp = /([\d.,]+)\s?(.+)/;
          const ironPerServing = ironText.match(ironRegexp) ? ironText.match(ironRegexp)[1] : '';
          const ironPerServingUom = ironText.match(ironRegexp) ? ironText.match(ironRegexp)[2] : '';

          listElem.setAttribute('iron_per_serving', ironPerServing);
          listElem.setAttribute('iron_per_serving_uom', ironPerServingUom);

          const magnesiumText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "МАГНИЙ", "магний") , "магний")]',
            // '//tr[td[contains(. , "магний")] and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const magnesiumRegExp = /([\d.,]+)\s?(.+)/;
          const magnesiumPerServing = magnesiumText.match(magnesiumRegExp)
            ? magnesiumText.match(magnesiumRegExp)[1]
            : '';
          const magnesiumPerServingUom = magnesiumText.match(magnesiumRegExp)
            ? magnesiumText.match(magnesiumRegExp)[2]
            : '';

          listElem.setAttribute('magnesium_per_serving', magnesiumPerServing);
          listElem.setAttribute('magnesium_per_serving_uom', magnesiumPerServingUom);

          const saltText = document.evaluate(
            '//*[(name()="tr" or name()="li") and contains(translate(. , "СОЛЬ", "соль"), "соль")]',
            // '//tr[td[contains(. , "соль")] and not(contains(. , "%"))]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          const saltRegexp = /([\d.,]+)\s?(.+)/;
          const saltPerServing = saltText.match(saltRegexp) ? saltText.match(saltRegexp)[1] : '';
          const saltPerServingUom = saltText.match(saltRegexp) ? saltText.match(saltRegexp)[2] : '';

          listElem.setAttribute('salt_per_serving', saltPerServing);
          listElem.setAttribute('salt_per_serving_uom', saltPerServingUom);

          const image360Present = !!(
            productObj &&
            productObj.images &&
            productObj.images.find((item) => item.type === '3d' && item.imagesArr.length)
          );
          listElem.setAttribute('image_360_present', image360Present.toString());

          const weightElem = document.querySelector(
            'div[class^="style_info"] div[class^="style_tile_wrapper"] > label[class*="style_active"] div[data-testid="WeightContent"]',
          );
          if (weightElem) listElem.setAttribute('weight', weightElem.textContent.trim());

          let ingredients = document.evaluate(
            'html//div[contains(@class, "style_composition__composition")]//*[b[contains(text(), "Ингредиенты") or contains(text(), "Состав")]] | html//div[contains(@class, "style_composition__composition")]//*[*[name() = "b" or name()="strong"][text() = "Ингредиенты" or text() = "Состав"]]/following-sibling::*[position() = 1]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          if (!ingredients) {
            ingredients = document.querySelector('div.composition-text__content')
              ? document.querySelector('div.composition-text__content').textContent
              : '';
          }
          if (!ingredients) {
            ingredients = document
              .evaluate(
                'html//div[contains(@class, "style_composition__composition")]//span[contains(. , "Состав:")]',
                document,
                null,
                XPathResult.STRING_TYPE,
                null,
              )
              .stringValue.replace('Состав:', '');
          }

          if (!ingredients) {
            const ingredientsElem = document.querySelector('div[class*="style_composition_composition"]');
            const ingredientsArr = [];
            if (ingredientsElem) digForText(ingredientsElem, ingredientsArr);
            ingredients = ingredientsArr.join(' ');
          }
          listElem.setAttribute('ingredients', ingredients.replace(/\n+/g, ' ').trim());

          let directions = document.body.getAttribute('directions');
          if (!directions) {
            directions = compositionText.match(/(Рекоменд.+)/) ? compositionText.match(/(Рекоменд.+)/)[1] : '';
            document.body.setAttribute('directions', directions);
          }

          const storageMatch = compositionText.match(/Условия хранения:?\s?(.+)/i);
          const storage = storageMatch ? storageMatch[1] : '';
          listElem.setAttribute('storage', storage);

          addedList.appendChild(listElem);
        },
        { variantsTotal, productDescription },
      );
    }
    await context.extract(productDetails, { transform });
  },
};
