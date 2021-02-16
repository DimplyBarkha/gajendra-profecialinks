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
    });
    await context.waitForSelector('#uc-btn-accept-banner');
    await context.click('#uc-btn-accept-banner');
    await context.evaluate(async () => {
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
          if(tdItem.previousSibling.textContent.includes('Nährwerttabelle')){
            tdItem.textContent = tdItem.textContent.replace(/</gmi, '');
            tdItem.textContent = tdItem.textContent + ' Data'
          }
        })
      })

    });
    return await context.extract(productDetails, { transform });
  },
};
