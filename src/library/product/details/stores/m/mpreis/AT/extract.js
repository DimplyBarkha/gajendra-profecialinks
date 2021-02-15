const { transform } = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform,
    domain: 'shop.mpreis.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await new Promise((resolve, reject) => setTimeout(resolve, 100000));
    // await context.waitForSelector('.prod-info');
    await context.evaluate(async () => {
      // let scrollTop = 0;
      // while (scrollTop <= 20000) {
      //   await stall(200);
      //   scrollTop += 2000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 30000) {
      //     await stall(2000);
      //     break;
      //   }
      // }
      // function stall (ms) {
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
      // Add string for propper regExp working
      const tables = document.querySelectorAll('table.table');
      tables.forEach(table => {
        table.querySelectorAll('td').forEach(tdItem => {
          tdItem.textContent = tdItem.textContent + ' Data'
        })
      })

    });
    return await context.extract(productDetails, { transform });
  },
};
