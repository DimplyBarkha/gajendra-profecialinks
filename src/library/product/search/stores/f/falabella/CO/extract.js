const { transform } = require('../format');

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
    });

   
  };
  await applyScroll(context);

  await context.evaluate(function name () {
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    transform,
    domain: 'falabella.com.co',
    zipcode: '',
  },
  implementation,
};
