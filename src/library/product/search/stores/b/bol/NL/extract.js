async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.modal__overlay');
  });
  // when the popup is present it returns undefined, when not - null
  if (isPopupPresent !== null && isPopupPresent !== undefined) {
    await context.evaluate(() => {
      document.querySelector('button.js-confirm-button').click();
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await context.evaluate(() => {
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    let ratings = document.querySelectorAll('.star-rating');
    const itereationLength = ratings.length;
    let seller;
    const sponsored = document.querySelectorAll('div.h-color-subtext.h-bottom--xs.small_details');
    let sponsoredIteration;

    for (let i = 0; i < itereationLength; i++) {
      ratings = document.querySelectorAll('.star-rating')[i].dataset.count;
      seller = document.querySelectorAll('div[data-test="plazaseller-link"]')[i];
      sponsoredIteration = sponsored[i];

      if (ratings === undefined && ratings !== null) {
        ratings = '0';
      };

      if (sponsoredIteration !== undefined && sponsoredIteration !== null) {
        sponsoredIteration = true;
      } else {
        sponsoredIteration = false;
      };

      if (seller !== undefined && seller !== null) {
        seller = seller.textContent;
        seller = seller.replace(/\s/g, ' ');
      } else {
        seller = 'Seller is not known';
      };

      addProp('.star-rating', i, 'ratingsCount', ratings);
      addProp('div.product-item__info.hit-area', i, 'sponsored', sponsoredIteration);
      addProp('wsp-buy-block.product-item__options.hit-area', i, 'seller', seller);
      addProp('wsp-buy-block.product-item__options.hit-area', i, 'rank', `${i + 1}`);
    };
  });

  return await context.extract(productDetails);
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: null,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation,
};
