const { transform } = require('./shared');


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    transform,
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // rank
      const cardsItems = document.querySelectorAll('.ao4>div');
      const currentPageNumber = + document.querySelector('.b9g0.b9g2').textContent - 1;

      if(cardsItems){
        cardsItems.forEach((item, index) => {
          const itemRank = (index + 1) + (36 * currentPageNumber);
          item.setAttribute('rank', itemRank.toString());
        });
      }

      // _url
      const pageUrl = window.location.href;
      addElementToDocument('pageUrl', pageUrl);
    })
    return await context.extract(productDetails, {transform});
  },
};


