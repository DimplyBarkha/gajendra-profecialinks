const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    transform,
    domain: 'misterspex.de',
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
    await context.setJavaScriptEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    context.evaluate(async() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
     

      // rank
      // const cardsItems = document.querySelectorAll('.spex-productList__products .spex-productList__item');
      // const currentPageNumber = + document.querySelector('.spex-pagination__item--current').textContent - 1;
      // console.log(cardsItems);
      // if(cardsItems){
      //   cardsItems.forEach((item, index) => {
      //     const itemRank = (index + 1) + (36 * currentPageNumber);
      //     item.setAttribute('rank', itemRank.toString());
      //   });
      // }

      // _url + _input
      const pageUrl = window.location.href;
      const cardsItems = document.querySelectorAll('.spex-productList__products .spex-productList__item');
      if(cardsItems){
        cardsItems.forEach(item => {
          item.setAttribute('ms-input', pageUrl);
          item.setAttribute('ms-url', pageUrl);
        });
      }
      addElementToDocument('pageUrl', pageUrl);
    })
    return await context.extract(productDetails, {transform});
  },
};
