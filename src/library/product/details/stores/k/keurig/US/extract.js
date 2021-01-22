const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    transform,
    domain: 'keurig.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const { input } = inputs;
    try {
      await context.click('div#_tealiumModalClose');
    } catch (error) {
      console.log('no sign up modal found');
    }
    await new Promise(resolve => setTimeout(resolve, 3500));
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div.footer-wrapper');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div.footer-wrapper');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      if (document.querySelector('div#s7viewer_swatches div[data-component="ScrollRightButton"]')) {
        addElementToDocument('pd_jsonimage', 'Yes');
        // @ts-ignore
        const alternateImages = window.performance && window.performance.getEntries() && window.performance.getEntries().filter(e => e.initiatorType === 'xmlhttprequest' && e.name.match(/(.*)images.keurig.com\/is\/image\/keurig(.*)/));
        if (alternateImages && alternateImages[0] && alternateImages[0].name) {
          const response = await fetch(`${alternateImages[0].name}`)
            .then(response => response.text())
            .catch(error => console.error('Error:', error));
          if (response && response.match(/"s":{"n":"keurig\/(.*?)"}/g)) {
            const images = response.match(/"s":{"n":"keurig\/(.*?)"}/g);
            if (images && images.length > 0) {
              images.forEach(image => {
                image.match(/"s":{"n":"(.*)"}/) && addElementToDocument('pd_images', image.replace(/"s":{"n":"(.*)"}/, 'https://images.keurig.com/is/image/$1'));
              });
            }
          }
        }
      }
    });
    try {
      await context.click('div.expand-collapse.collapsed a');
    } catch (error) {
      console.log('see more button not found');
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
