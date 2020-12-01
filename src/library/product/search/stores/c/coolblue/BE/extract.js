const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('div.cookie button[name="accept_cookie"]'));
    });

    if (doesPopupExist) {
      await context.click('div.cookie button[name="accept_cookie"]');
    }
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      if (document.querySelector('#added-searchurl') !== null) {
        document.querySelector('#added-searchurl').innerHTML = url;
      } else {
        addHiddenDiv('added-searchurl', url);
      }
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
