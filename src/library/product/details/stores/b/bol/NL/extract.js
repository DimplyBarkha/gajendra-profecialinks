// @ts-nocheck
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: cleanUp,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    // if we're on search site we should click and select first item
    var detailsPage = await context.evaluate(async () => {
      if (document.querySelector('a.product-title.px_list_page_product_click') != null) {
        var productLink = document.querySelector('a.product-title.px_list_page_product_click').getAttribute('href');
      }
      return productLink;
    });

    // check if detailsPage exists
    if (detailsPage) {
      await context.goto('https://bol.com' + detailsPage);
      await context.waitForNavigation();
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    const isActive = await context.evaluate(async () => {
      const acceptButton = document.querySelector('button[class="js-confirm-button"]');
      if (acceptButton) {
        return acceptButton;
      } else return null;
    });

    if (isActive) {
      await context.click('button[class="js-confirm-button"]');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // const isBelgium = await context.evaluate(async () => {
    //   const acceptButton = document.querySelector('a[data-analytics-tag="firstBelgiumVisit_dutch_country_nl"]');
    //   if (acceptButton) {
    //     return acceptButton;
    //   } else return null;
    // });

    // if (isBelgium) {
    //   await context.click('a[data-analytics-tag="firstBelgiumVisit_dutch_country_nl"]');
    // }

    await context.evaluate(async function () {
      const addElementToDom = (element, id) => {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      };

      /** Function used to extract all paragraph's text between two given titles.
       * If no 'startTitle' provided, it starts adding from the beginning.
       * If no 'stopTitle' provided, it doesn't stop and adds everything to the end
       * @param {object} node Parent node of all elements we want to iterate over
       * @param {string} startTitle Paragraph's textContent that once we meet we start adding following paragraph's text
       * @param {string} stopTitle Paragraph's textContent that once we meet we stop adding following paragraph's text
       */
      const addFollowingParagraphs = (node, startTitle, stopTitle) => {
        const allElements = node.childNodes;
        let result = '';
        let reading;
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (!startTitle || element.textContent.trim().startsWith(startTitle)) reading = true;
          if (stopTitle && element.textContent.trim().startsWith(stopTitle)) reading = false;
          if (reading) {
            result = result.length > 0 ? `${result}${element.textContent.trim()}\n` : `${element.textContent.trim()}\n`;
          }
        }
        return result.trim().replace(/\n+/g, '\n');
      };

      // autoclick
      var moreButtons = document.querySelectorAll('a.show-more__button');
      moreButtons.forEach(async (element) => {
        // @ts-ignore
        element.click();
      });

      const stall = (ms) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      };

      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(500);
          break;
        }
      }

      // adding alternate images
      const altImagesList = document.createElement('ol');
      altImagesList.id = 'alternate_images_list';
      altImagesList.style.display = 'none';
      document.body.appendChild(altImagesList);
      const imgThumbnails = document.querySelectorAll('div[data-test="product-images"] ul > li:not(.nav--video-still)');
      const iterations = imgThumbnails.length || 1;
      for (let i = 0; i < iterations; i++) {
        if (imgThumbnails.length) {
          const elem = imgThumbnails[i];
          elem.click();
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        const image = document.querySelector('div[data-test="product-image-content"] img');
        if (image) {
          const listItem = document.createElement('li');
          const src = image.getAttribute('src');
          const alt = image.getAttribute('alt');
          listItem.setAttribute('src', src);
          listItem.setAttribute('alt', alt);
          altImagesList.appendChild(listItem);
        }
      }

      // get price
      var priceElem = document.querySelector('span[class="promo-price"]');
      if (priceElem) {
        const regex = /\d+/gm;
        const priceOne = priceElem.childNodes[0].textContent.match(regex);
        const priceTwo = priceElem.childNodes[1].textContent.match(regex);
        let price = '';
        if (priceTwo !== null) {
          price = '€ ' + priceOne + ',' + priceTwo;
        } else {
          price = '€ ' + priceOne;
        }
        addElementToDom(price, 'price');
      }

      // convert rating
      var rawRating = document.querySelector('div[class="rating-horizontal__average-score"]');
      if (rawRating) {
        var text = document.querySelector('div[class="rating-horizontal__average-score"]').textContent;
        rawRating.setAttribute('rating', text.toString().replace('.', ','));
      }

      // add availability
      let availabilityText = document.querySelector('div[class="buy-block__highlight h-boxedright--xxs"]')
        ? document.querySelector('div[class="buy-block__highlight h-boxedright--xxs"]').textContent
        : null;
      if (!availabilityText) {
        availabilityText = document.querySelector('div[class="buy-block__title"]')
          ? document.querySelector('div[class="buy-block__title"]').textContent
          : null;
      }

      addElementToDom(availabilityText, 'availability');

      // add priceperunituom
      const pricePerUnitElem = document.querySelector('div[data-test="unit-price"]');
      var pricePerUnitUom =
        pricePerUnitElem && pricePerUnitElem.textContent && pricePerUnitElem.textContent.match(/[a-z]+/g)
          ? pricePerUnitElem.textContent.match(/[a-z]+/g)[1]
          : null;
      addElementToDom(pricePerUnitUom, 'pricePerUnitUom');

      // add nutrients informations
      const nutrientsElem = document.evaluate(
        '//dt[normalize-space(text())="Voedingswaarde"]/following-sibling::dd[1]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (nutrientsElem) {
        let energy;
        let fiber;
        let sugars;
        let protein;
        let fat;

        const nutrientsText = nutrientsElem.textContent.trim();
        let nutrientsList = nutrientsText.split('|');
        if (nutrientsList.length <= 1) nutrientsList = nutrientsText.split(', ');

        if (nutrientsList.length > 1) {
          nutrientsList.forEach((element) => {
            if (element.includes('Energie')) {
              energy = element.replace('Energie', '');
            } else if (element.includes('Vezels')) {
              fiber = element.replace('Vezels', '');
            } else if (element.includes('suikers')) {
              if (element.match(/suikers ([\d.,]+.+?g)/)) {
                sugars = element.match(/suikers ([\d.,]+.+?g)/)[1];
              } else {
                addElementToDom(element, 'sugars');
              }
            } else if (element.includes('Eiwitten')) {
              protein = element.replace('Eiwitten', '');
            }
          });
        }
        if (!energy) {
          energy = nutrientsText.match(/Energie\s([\d.,]+\s?k(j|cal))/i)
            ? nutrientsText.match(/Energie\s([\d.,]+\s?k(j|cal))/i)[1]
            : '';
        }
        if (!fiber) {
          fiber = nutrientsText.match(/Vezels?\s([\d.,]+\s?\w?g)/i)
            ? nutrientsText.match(/Vezels?\s([\d.,]+\s?\w?g)/i)[1]
            : '';
        }
        if (!sugars) {
          sugars = nutrientsText.match(/suikers\s([\d.,]+\s?\w?g)/i)
            ? nutrientsText.match(/suikers\s([\d.,]+\s?\w?g)/i)[1]
            : '';
        }
        if (!protein) {
          protein = nutrientsText.match(/Eiwitten\s([\d.,]+\s?\w?g)/i)
            ? nutrientsText.match(/Eiwitten\s([\d.,]+\s?\w?g)/i)[1]
            : '';
        }
        if (!fat) {
          fat = nutrientsText.match(/vetten? ([\d,.]+ \w?g)/i) ? nutrientsText.match(/vetten? ([\d,.]+ \w?g)/i)[1] : '';
        }
        addElementToDom(energy, 'energy');
        addElementToDom(fiber, 'fiber');
        addElementToDom(sugars, 'sugars');
        addElementToDom(protein, 'protein');
        addElementToDom(fat, 'fat');
      }

      // descrption modification and bullets
      const descriptionElement = document.querySelector('div[class="product-description"]');
      const descriptionLiElements = document.querySelectorAll('div[class="product-description"] ul li');
      const descriptionUlElement = document.querySelector('div[class="product-description"] ul');
      if (descriptionElement && descriptionUlElement) {
        descriptionElement.removeChild(descriptionUlElement);
      }
      let descriptionText = descriptionElement ? descriptionElement.innerText : '';
      const descriptionLiTexts = [];
      descriptionLiElements.forEach((elem) => {
        descriptionLiTexts.push(elem.innerText ? elem.innerText : '');
      });
      const descriptionBulletsText = descriptionLiTexts.length ? ' || ' + descriptionLiTexts.join(' || ') : '';
      descriptionText += descriptionBulletsText;

      const count =
        (descriptionText.match(/^\s*•/gm) || []).length +
        (descriptionText.match(/^-\s*/gm) || []).length +
        descriptionLiElements.length;
      const modifiedDesc = descriptionText.replace(/^\s*•/gm, ' || ').replace(/^\s*-/gm, ' || ').replace(/\\n+/g, ' ');
      if (count) addElementToDom(count, 'bulletsCount');
      addElementToDom(modifiedDesc, 'description');
      addElementToDom(descriptionBulletsText, 'additionalDescBulletInfo');

      // specifications
      // const specificationsElements = document.querySelectorAll('div[data-test="specifications"] dt, dd');
      // let specificationText = '';
      // specificationsElements.forEach((elem, index) => {
      //   if (index % 2 !== 0) {
      //     specificationText += elem.textContent + ' || ';
      //   } else {
      //     specificationText += elem.textContent + ' ';
      //   }
      // });
      // if (specificationsElements) {
      //   addElementToDom(specificationText, 'specifications');
      // }

      let specificationsArr = [];
      const specs = document.evaluate(
        '//dl[@class="specs__list"]/dt[@class="specs__title"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < specs.snapshotLength; i++) {
        const specName = specs.snapshotItem(i).textContent.trim();
        const specValue = specs.snapshotItem(i).nextElementSibling.textContent.trim();
        if (specName.toLowerCase().includes('verpakking')) {
          specificationsArr.push(`${specName}: ${specValue}`);
        }
      }
      specificationsArr = specificationsArr.filter(
        (item) => !item.toLowerCase().includes('aantal') && !item.toLowerCase().includes('verpakkingsinhoud'),
      );
      addElementToDom(specificationsArr.join(' | '), 'specifications');

      let ingredientsText = document.evaluate(
        '//dt[normalize-space(text())="Ingrediënten"]/following-sibling::dd[1]',
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      ).stringValue;
      if (!ingredientsText) {
        ingredientsText = document.evaluate(
          '//dt[normalize-space(text())="Voedingswaarde"]/following-sibling::dd[1]',
          document,
          null,
          XPathResult.STRING_TYPE,
          null,
        ).stringValue;
      }
      if (!ingredientsText) {
        const descriptionElem = document.querySelector('div[data-test="description"]');
        if (descriptionElem) ingredientsText = addFollowingParagraphs(descriptionElem, 'Ingrediënten');
      }
      ingredientsText = ingredientsText.replace(/<.+?>/g, '').trim();
      ingredientsText = ingredientsText.match(/\w+/) ? ingredientsText : '';
      addElementToDom(ingredientsText, 'ingredients_list');

      let directionsTextArr = [];
      const directions = document.evaluate(
        '//div[@class="specs"][h3[contains(text(), "Gebruik")]]/dl/dt[@class="specs__title"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < directions.snapshotLength; i++) {
        const titleElem = directions.snapshotItem(i);
        const title = titleElem.innerText.replace(/tooltip/i, '').trim();
        const valueElem = titleElem.nextElementSibling;
        const value = valueElem.innerText.replace(/tooltip/i, '').trim();
        directionsTextArr.push(`${title}: ${value}`);
      }

      const otherDirections = document
        .evaluate(
          '//dt[@class="specs__title" and contains(. , "Voedingsadvies")]/following-sibling::dd[position() = 1]',
          document,
          null,
          XPathResult.STRING_TYPE,
          null,
        )
        .stringValue.trim();
      if (!directionsTextArr.length && otherDirections) directionsTextArr.push(otherDirections);

      directionsTextArr = directionsTextArr.map((item) => item.replace(/\\n/g, ' ').replace(/<br \/>/g, ' '));
      addElementToDom(directionsTextArr.join(' || '), 'added_directions');

      const manufacturerDescArr = [];
      const manufacturerDesc = document.evaluate(
        '//div[@data-test="main-specs"]//ul[contains(@class, "product-small-specs")]/li',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < manufacturerDesc.snapshotLength; i++) {
        const elem = manufacturerDesc.snapshotItem(i);
        manufacturerDescArr.push(`${elem.textContent.trim()}`);
      }
      addElementToDom(manufacturerDescArr.join(' || '), 'manufacturer_description');

      const ratingElem = document.querySelector('div.rating-horizontal__average-score');
      let ratingText = ratingElem ? ratingElem.textContent.replace('.', ',') : '';
      if (ratingText.length === 1) ratingText = `${ratingText},0`;
      addElementToDom(ratingText, 'aggregate_rating');

      const weightNet = document
        .evaluate(
          '//dt[normalize-space(text())="Gewicht"]/following-sibling::dd[1]',
          document,
          null,
          XPathResult.STRING_TYPE,
          null,
        )
        .stringValue.replace(',', '.');
      addElementToDom(weightNet, 'weight_net');

      const shippingInfoElem = document.querySelector('div.buy-block div.product-seller');
      const shippingInfo = shippingInfoElem ? shippingInfoElem.textContent.replace('Verkoop door', '').trim() : '';
      addElementToDom(shippingInfo, 'shipping_info');

      const quantity = document.evaluate(
        '//dt[normalize-space(text())="Inhoud"]/following-sibling::dd[1]',
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      ).stringValue;
      addElementToDom(quantity.replace(',', '.'), 'added_quantity');
    });

    await context.evaluate(async function () {
      const videosList = document.createElement('ol');
      videosList.id = 'videos_list';
      videosList.style.display = 'none';
      document.body.appendChild(videosList);

      // // video
      // const videoButton =
      //   document.querySelector('a[data-test="product-video"]') ||
      //   document.querySelector('img[data-test="product-video-still"] + button');
      // if (videoButton) {
      //   // @ts-ignore
      //   videoButton.click();
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      // }

      const allThumbnails = document.querySelectorAll('div[data-test="product-images"] ul > li');
      for (let i = 0; i < allThumbnails.length; i++) {
        const elem = allThumbnails[i];
        elem.click();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const videoButton = document.querySelector('img[data-test="product-video-still"] + button');
        if (videoButton) {
          videoButton.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const videoElem = document.querySelector('div[data-test="wsp-video-element"] > video > source');
          if (videoElem && videoElem.src) {
            const listItem = document.createElement('li');
            listItem.setAttribute('src', videoElem.src);
            videosList.appendChild(listItem);
          }
          const closeButton = document.querySelector('div.modal__window--close');
          if (closeButton) {
            closeButton.click();
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }
    });

    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';
      document.body.appendChild(variantsList);

      const selectedVariantId = window.location.href.match(/(\d{16}).*$/)
        ? window.location.href.match(/(\d{16}).*$/)[1]
        : '';
      let selectedVariantName = '';
      const availableVariants = document.evaluate(
        '(//div[@data-test="features"]//div[@data-test="feature-options"])[1]/a',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < availableVariants.snapshotLength; i++) {
        const listItem = document.createElement('li');
        const variant = availableVariants.snapshotItem(i);
        const variantUrl = variant.href;
        const variantId = variantUrl.match(/(\d+)\/\?.*$/) ? variantUrl.match(/(\d+)\/\?.*$/)[1] : '';
        if (variantId === selectedVariantId) {
          selectedVariantName = variant.querySelector('span[class^="feature-"]')
            ? variant.querySelector('span[class^="feature-"]').textContent.trim()
            : '';
          if (!selectedVariantName) {
            selectedVariantName = variant.querySelector('img') ? variant.querySelector('img').alt : '';
          }
          if (!selectedVariantName) {
            selectedVariantName = variant.querySelector('div[data-test="label"] > span')
              ? variant.querySelector('div[data-test="label"] > span').textContent.trim()
              : '';
          }
        }
        listItem.setAttribute('variant_id', variantId);
        variantsList.appendChild(listItem);
      }
      variantsList.setAttribute('selected_variant_name', selectedVariantName);
      variantsList.setAttribute('selected_variant_id', selectedVariantId);
    });

    try {
      await context.evaluate(() => {
        let currentUrl = window.location.href;
        currentUrl = currentUrl.split('?')[0];
        let name = document.querySelector('.page-heading span').innerText;
        if (!name) {
          name = document.querySelector('.product-description').innerText;
        }
        const div = document.createElement('div');
        div.id = 'productUrl';
        div.innerText = currentUrl;
        div.setAttribute('product-name', name.replace(/\|/g, ' - '));
        document.body.appendChild(div);
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(productDetails, { transform });
  },
};
