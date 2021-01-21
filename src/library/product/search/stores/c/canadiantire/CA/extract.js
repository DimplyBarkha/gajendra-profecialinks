const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let productId = document.querySelector('a.global-header__header-top-bar__input__language') && document.querySelector('a.global-header__header-top-bar__input__language').getAttribute('href');
    const productPrice = document.querySelector('span.price__reg-value') && document.querySelector('span.price__reg-value');
    let productImage = document.querySelector('img.product-tile-srp__image') ? document.querySelector('img.product-tile-srp__image').src : document.querySelector('div#pdp-product-image img') && document.querySelector('div#pdp-product-image img').src;
    if (!(productImage && productImage.includes('https:'))) {
      productImage = `https:${productImage}`;
    }
    const regExp = '(\\d+)(.*?).html';
    if (productId && productId.includes('p.html')) {
      console.log('-------->', productId);
      productId = productId.match(regExp)[0].replace('.html', '');
    }
    addHiddenDiv('pd_productId', productId);
    addHiddenDiv('pd_productPrice', productPrice);
    addHiddenDiv('pd_productImage', productImage);
  });
  async function paginate () {
    try {
      const hasNextLink = await context.evaluate((selector) => !!document.querySelector('div[style*="block"]>a.search-results-grid__load-more-results__link'));
      if (hasNextLink) {
        await Promise.all([
          context.click('div[style*="block"]>a.search-results-grid__load-more-results__link'),
          // possible race condition if the data returned too fast, but unlikely
          context.waitForMutuation('div[data-component="SearchResultsGrid"]', { timeout: 20000 }),
        ]);
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await context.waitForXPath('//div[@class="bv-off-screen"]');
  } catch (error) {
    console.log('could not load ratings', error);
  }
  let length = await context.evaluate(async function () {
    return document.querySelectorAll('div[data-component="ProductTileSrp"]').length;
  });
  let oldLength = 0;
  while (length && length !== oldLength && length <= 150) {
    oldLength = length;
    await paginate();
    try {
      await context.waitForXPath('//div[@class="bv-off-screen"]');
    } catch (error) {
      console.log('could not load ratings', error);
    }
    length = await context.evaluate(async function () {
      return document.querySelectorAll('div[data-component="ProductTileSrp"]').length;
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
  implementation,
};
