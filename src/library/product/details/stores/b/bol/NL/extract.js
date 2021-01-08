// @ts-nocheck
const { cleanUp } = require('../../../../shared');

const implementation = async (inputs, { transform }, context, { productDetails }) => {
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
    const imgThumbnails = document.querySelectorAll('div[data-test="product-images"] ul > li');
    for (let i = 1; i < imgThumbnails.length; i++) {
      const elem = imgThumbnails[i];
      elem.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const image = document.querySelector('div[data-test="product-image-content"] img');
      if (image) {
        const listItem = document.createElement('li');
        listItem.innerHTML = image.getAttribute('src');
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
    const isNutrientsAvail = document.evaluate(
      '//dt[normalize-space(text())="Voedingswaarde"]/following-sibling::dd[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    if (isNutrientsAvail.singleNodeValue) {
      const nutrientsText = isNutrientsAvail.singleNodeValue.textContent;
      const nutrientsList = nutrientsText.split(',');

      nutrientsList.forEach((element) => {
        if (element.includes('Energie')) {
          addElementToDom(element, 'energy');
        } else if (element.includes('Vezels')) {
          addElementToDom(element, 'fiber');
        } else if (element.includes('suikers')) {
          addElementToDom(element, 'sugars');
        } else if (element.includes('Eiwitten')) {
          addElementToDom(element, 'protein');
        }
      });
    }

    // descrption modification and bullets
    const descriptionElement = document.querySelector('div[class="product-description"]');
    const descriptionLiElements = document.querySelectorAll('div[class="product-description"] ul li');
    const descriptionUlElement = document.querySelector('div[class="product-description"] ul');
    if (descriptionElement && descriptionUlElement) {
      descriptionElement.removeChild(descriptionUlElement);
    }
    let descriptionText = descriptionElement ? descriptionElement.textContent : '';
    const descriptionLiTexts = [];
    descriptionLiElements.forEach((li) => {
      descriptionLiTexts.push(li.textContent ? li.textContent : '');
    });
    const descriptionBulletsText = descriptionLiTexts.length ? ' || ' + descriptionLiTexts.join(' || ') : '';
    descriptionText += descriptionBulletsText;

    const count = (descriptionText.match(/•/g) || []).length + descriptionLiElements.length;
    const modifiedDesc = descriptionText.replace(/•/gi, ' || ');
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
    ingredientsText = ingredientsText.replace(/<.+?>/g, '').trim();
    ingredientsText = ingredientsText.match(/\w+/) ? ingredientsText : '';
    addElementToDom(ingredientsText, 'ingredients_list');

    const directionsTextArr = [];
    const directions = document.evaluate(
      '(//div[@class="specs" and contains(. , "Gebruiks")])[1]/dl/dt[@class="specs__title"]',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    );
    for (let i = 0; i < directions.snapshotLength; i++) {
      const titleElem = directions.snapshotItem(i);
      const valueElem = titleElem.nextElementSibling;
      directionsTextArr.push(`${titleElem.textContent.trim()} ${valueElem.textContent.trim()}`);
    }
    addElementToDom(directionsTextArr.join('|'), 'added_directions');

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
      manufacturerDescArr.push(elem.textContent.trim());
    }
    addElementToDom(manufacturerDescArr.join(' || '), 'manufacturer_description');

    const ratingElem = document.querySelector('div.rating-horizontal__average-score');
    const ratingText = ratingElem ? ratingElem.textContent.replace('.', ',') : '';
    addElementToDom(ratingText, 'aggregate_rating');
  });

  await context.evaluate(async function () {
    // video
    if (document.querySelector('a[data-test="product-video"]')) {
      const videoButton = document.querySelector('a[data-test="product-video"]');
      // @ts-ignore
      videoButton.click();

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }
  });

  await context.evaluate(async () => {
    const variantsList = document.createElement('ol');
    variantsList.id = 'added_variants_list';
    variantsList.style.display = 'none';
    document.body.appendChild(variantsList);

    const selectedVariantId = window.location.href.match(/(\d+)\/\?.*$/)
      ? window.location.href.match(/(\d+)\/\?.*$/)[1]
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
      }
      listItem.setAttribute('variant_id', variantId);
      variantsList.appendChild(listItem);
    }
    variantsList.setAttribute('selected_variant_name', selectedVariantName);
    variantsList.setAttribute('selected_variant_id', selectedVariantId);
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: cleanUp,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation,
};
