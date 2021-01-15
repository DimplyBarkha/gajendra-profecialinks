// const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    console.log('calling applyScroll-----------');

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        console.log('calling applyScroll evaluate-----------', window);
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const searchUrl = window.location.href.replace('%20', ' ');
      const lastPageUrl = document.querySelector('div#search-url');
      if (lastPageUrl) {
        // @ts-ignore
        lastPageUrl.innerText = searchUrl;
      } else {
        const hiddenSearchDiv = document.createElement('div');
        hiddenSearchDiv.id = 'search-url';
        hiddenSearchDiv.style.display = 'none';
        hiddenSearchDiv.textContent = searchUrl;
        document.body.appendChild(hiddenSearchDiv);
      }
    });
  };
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    transform: null,
    domain: 'pampik.com',
    zipcode: '',
  },
  implementation,
};
