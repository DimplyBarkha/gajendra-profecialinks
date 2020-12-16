const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: transform,
    domain: 'jpg.fr',
    zipcode: '',
  }, 
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
    await context.evaluate(async () => {
      try {
        // @ts-ignore
      document.querySelector('button[id=onetrust-accept-btn-handler]').click()
      await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
        
      }     
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const URL = window.location.href;
      addElementToDocument('pd_url', URL);
    });

    return await context.extract(productDetails, { transform });
  },
};