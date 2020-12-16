const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // if we're on search site we should click and select first item
  var detailsPage = await context.evaluate(async () => {
    if (
      document.querySelector('a.product-title.px_list_page_product_click') !=
      null
    ) {
      var productLink = document
        .querySelector('a.product-title.px_list_page_product_click')
        .getAttribute('href');
    }
    return productLink;
  });

  // check if detailsPage exists
  if (detailsPage) {
    await context.goto('https://bol.com' + detailsPage);
  }

  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const isActive = await context.evaluate(async () => {
    const acceptButton = document.querySelector('button[class="js-confirm-button"]');
    if (acceptButton) {
      return acceptButton;
    } else return null;
  });

  if (isActive) {
    await context.click('button[class="js-confirm-button"]');
  }

  // await new Promise((resolve) => setTimeout(resolve, 2000));

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
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    // autoclick
    var moreButtons = document.querySelectorAll('a.show-more__button');
    moreButtons.forEach(async (element) => {
      // @ts-ignore
      element.click();
    });

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    while (scrollTop !== 10000) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 10000) {
        await stall(1000);
        break;
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
    var rawRating = document.querySelector(
      'div[class="rating-horizontal__average-score"]',
    );
    if (rawRating) {
      var text = document.querySelector(
        'div[class="rating-horizontal__average-score"]',
      ).textContent;
      rawRating.setAttribute('rating', text.toString().replace('.', ','));
    }

    // add availability
    var availabilityText = document.querySelector(
      'div[class="buy-block__highlight h-boxedright--xxs"]')
      ? document.querySelector('div[class="buy-block__highlight h-boxedright--xxs"]').textContent
      : document.querySelector('div[class="buy-block__title"]') ? document.querySelector(
        'div[class="buy-block__title"]').textContent : null;

    addElementToDom(availabilityText, 'availability');

    // add priceperunituom
    var pricePerUnitUom = document.querySelector('div[data-test="unit-price"]')
      ? document.querySelector('div[data-test="unit-price"]').textContent.match(/[a-z]+/g).pop() : null;
    addElementToDom(pricePerUnitUom, 'pricePerUnitUom');

    // add nutrients informations
    const isNutrientsAvail = document.evaluate('//dt[normalize-space(text())="Voedingswaarde"]/following-sibling::dd[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (isNutrientsAvail.singleNodeValue) {
      const nutrientsText = isNutrientsAvail.singleNodeValue.textContent;
      const nutrientsList = nutrientsText.split(',');

      nutrientsList.forEach(element => {
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
    const descriptionLiElements = document.querySelectorAll(
      'div[class="product-description"] ul li');
    const descriptionUlElement = document.querySelector(
      'div[class="product-description"] ul');
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
    addElementToDom(count, 'bulletsCount');
    addElementToDom(modifiedDesc, 'description');
    addElementToDom(descriptionBulletsText, 'additionalDescBulletInfo');

    // specifications
    const specificationsElements = document.querySelectorAll('div[data-test="specifications"] dt, dd');
    let specificationText = '';
    specificationsElements.forEach((elem, index) => {
      if (index % 2 !== 0) {
        specificationText += elem.textContent + ' || ';
      } else {
        specificationText += elem.textContent + ' ';
      }
    });
    if (specificationsElements) {
      addElementToDom(specificationText, 'specifications');
    }
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

  return await context.extract(productDetails, { transform });
}

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
