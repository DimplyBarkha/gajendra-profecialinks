const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    var prodImg = document.querySelector(
      'div[class="product-main__image-container"] img[class="product-slider__image lazyloaded"]');
    var prodImgAttr;
    var prodContainer;
    if (prodImg !== null) {
      prodImgAttr = prodImg.getAttribute('src');
      prodContainer = document.querySelector(
        'div[class="product-main__image-container"]');
      prodContainer.setAttribute('img_url', prodImgAttr);
    } else {
      prodImgAttr = document
        .querySelector('div[class="product-main__image-container"] img')
        .getAttribute('src');
      prodContainer = document.querySelector(
        'div[class="product-main__image-container"]',
      );
      prodContainer.setAttribute('img_url', prodImgAttr);
    }

    // more images
    var moreImgs = document.querySelectorAll(
      'div[class="product-slider__navigation"] img');
    const prefix = 'https://thewhiskyexchange.com';
    moreImgs.forEach((element, index) => {
      if (index > 0) {
        element.setAttribute(
          'otherimgs',
          prefix + element.getAttribute('data-original'));
      }
    });

    // join facts into description
    var facts = document.querySelectorAll('li[class="product-facts__item"]');
    var description = '';
    facts.forEach((element) => {
      description += element.children[1].textContent.concat(
        ': ',
        element.children[2].textContent,
        '\n',
      );
    });

    var elem = document.createElement('div');
    elem.classList.add('otherProdInfo');
    elem.innerText = description;
    elem.style.display = 'none';
    document.body.appendChild(elem);

    // filter breadcrumbs
    var breadcrumps = document.querySelectorAll(
      'div[class="breadcrumb"] li[class="breadcrumb__item"] a');
    breadcrumps.forEach((element, index) => {
      if (index > 0) {
        element.setAttribute('category', element.textContent);
      }
    });

    // convert priceperunit unit
    const unitElem = document.querySelector("p[class='product-action__unit-price']");
    if (unitElem) {
      const text = unitElem.textContent;
      const regexpUnit = /per ([a-z0-9]+)/;
      const result = text.match(regexpUnit);
      unitElem.setAttribute('unit', result[1].toString());
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    transform: transform,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
  implementation,
};
