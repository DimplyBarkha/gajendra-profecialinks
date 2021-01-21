const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    transform,
    domain: 'hoogvliet.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const recordSelector = 'div#product-list div.product-list div.product-list-item';
        let count = document.querySelectorAll(recordSelector).length;
        let currScroll = document.documentElement.scrollTop;
        while (count < 150) {
          const oldScroll = currScroll;
          window.scrollBy(0, 500);
          await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          window.scrollBy(0, 500);
          await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          currScroll = document.documentElement.scrollTop;
          count = document.querySelectorAll(recordSelector).length;
          if (oldScroll === currScroll) {
            break;
          }
        }

        const searchUrl = window.location.href.replace('%20', ' ');
        const lastPageUrl = document.querySelector('link[rel="next"]');
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

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
