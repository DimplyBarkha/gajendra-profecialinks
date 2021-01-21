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
    // await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async() => {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(100);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(3000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
     

      // _url + _input
      const pageUrl = window.location.href;
      const cardsItems = document.querySelectorAll('.spex-productList__products .spex-productList__item');
      if(cardsItems){
        cardsItems.forEach(item => {
          item.setAttribute('ms-input', pageUrl);
          item.setAttribute('ms-url', pageUrl);
          const thumbSrc =  item.querySelector('img');
          if(thumbSrc){
            item.setAttribute('ms-thumb', thumbSrc.getAttribute('data-src'));
          }
        });
      }
      addElementToDocument('pageUrl', pageUrl);
    })
    return await context.extract(productDetails, {transform});
  },
};
