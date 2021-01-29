const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      document.querySelector(('.box-produto a')).removeAttribute('onClick');
      document.querySelector(('.box-produto a')).removeEventListener('click', () => {
      }, false);
    });
    // await new Promise((resolve, reject) => setTimeout(resolve, 100000));
    await context.waitForSelector('.box-produto a');
    await context.clickAndWaitForNavigation('.box-produto a', {}, {});
    await context.evaluate(async () => {
      // let scrollTop = 0;
      // while (scrollTop <= 20000) {
      //   await stall(100);
      //   scrollTop += 1000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 20000) {
      //     await stall(3000);
      //     break;
      //   }
      // }
      // function stall(ms) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, ms);
      //   });
      // }
      function addElementToDocument (key, value) {
        const createdElem = document.querySelector(`#${key}`);
        if (!createdElem) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      }

      const jsonDataNodes = document.querySelectorAll('[type="application/ld+json"]');
      let jsonDataText = '';
      jsonDataNodes.forEach(jsonDataNode => {
        const jsonDataNodeText = jsonDataNode.textContent;
        jsonDataNodeText.includes('price') ? jsonDataText = jsonDataNodeText : '';
      });
      const jsonDataObject = JSON.parse(jsonDataText);
      console.log(jsonDataObject);
      if (jsonDataObject) {
        // pirce
        addElementToDocument('ag-price', jsonDataObject.offers.price);
        // availabilityText
        if (jsonDataObject.offers.availability) {
          jsonDataObject.offers.availability.includes('OutOfStock')
            ? addElementToDocument('ag-availability', 'Out of Stock')
            : addElementToDocument('ag-availability', 'In Stock');
        }
      }

      // zoom
      const mainImg = document.querySelector('.box-galeria img');
      if (mainImg.classList.contains('zoom')) {
        addElementToDocument('ag-zoom', 'Yes');
      }

      // descriptionBullets
      const descrInfo = document.querySelector('.box-info-produto__info');
      if (descrInfo) {
        const descrInfoText = descrInfo.textContent;
        const bulletsMatch = descrInfoText.match(/•/gmi);
        if (bulletsMatch) {
          addElementToDocument('ag-desc-bullets', bulletsMatch.length);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};

