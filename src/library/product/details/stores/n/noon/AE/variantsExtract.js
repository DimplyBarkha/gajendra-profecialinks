const { transform } = require('../variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    await context.evaluate(() => {
      function createDiv (id, value) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = value;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (!document.querySelector('.section')) {
        if (document.querySelector('meta[property="og:image"]').getAttribute('content')) {
          createDiv('variants', document.querySelector('meta[property="og:image"]').getAttribute('content'));
        }
      } else {
        // @ts-ignore
        const n = [...document.querySelectorAll('.section ul>li img')].length;
        for (let i = 0; i < n; i++) {
          const n = i + 1;
          const selector = '.section ul>li:nth-child(' + n + ') img';
          console.log(selector);
          createDiv('variants', document.querySelector(selector).getAttribute('src'));
        }
      }
    });
    return await context.extract(variants, { transform });
  },
};
