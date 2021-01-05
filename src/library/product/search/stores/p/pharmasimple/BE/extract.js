const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 4000));
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    if (document.querySelector('#promo_popin button.close')) {
      console.log('Close popup');
      // @ts-ignore
      await document.querySelector('#promo_popin button.close').click('#promo_popin button.close');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // add search url
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);
    console.log(document.querySelectorAll('ul[class="product_list grid row"] div.product-container a.product-name').length + ' products found');
    // convert percentage rating to number and then to string
    document.querySelectorAll('div.product-container div.ratingWrapper').forEach((element) => {
      const ratingNode = element.querySelector('div.ratingInner');
      // @ts-ignore
      const reviewsTitle = element.parentNode ? element.parentNode.getAttribute('title') : '';
      const reviewsNum = reviewsTitle && reviewsTitle.match(/(\d+) avis/)
        ? reviewsTitle.match(/(\d+) avis/)[1] : '0';
      element.setAttribute('reviews-num', reviewsNum);
      const regArray = ratingNode ? ratingNode.getAttribute('style').match(/\d+\.?(\d+)?%/gm) : [];
      const value = regArray.length ? (parseInt(regArray[0]) * 5) / 100 : null;
      if (value) element.setAttribute('rating', value.toString().replace('.', ','));
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    transform: transform,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
  implementation,
};
