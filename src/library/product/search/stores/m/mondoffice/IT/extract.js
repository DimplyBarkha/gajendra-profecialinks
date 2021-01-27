const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
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
    await context.evaluate(async() => {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(200);
        scrollTop += 4000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(1000);
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
      addElementToDocument('mo-url', location.href);
      console.log(document.querySelector('#mo-url'));

      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const cardName = card.querySelector('figure');
        cardName.setAttribute('mo-url', location.href);
      })
    });
    // await new Promise((resolve, reject) => setTimeout(resolve,100000));
    return await context.extract(productDetails, { transform });
  },
};
