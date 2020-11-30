const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let scrollTop = 0;
    const scrollLimit = 30000;
    const scroll = async function () {
      while (scrollTop !== scrollLimit) {
        await stall(2000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === scrollLimit) {
          await stall(5000);
          break;
        }
      }
    };
    scroll();

    await stall(2000);
    const moreItems = document.querySelector(
      '.c-show-more.o-button.--secondary-cta.initialized',
    );

    if (moreItems) {
      do {
        // @ts-ignore
        moreItems.click();
        await stall(5000);
      } while (!moreItems.className.includes('u-hidden'));
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.listing-items.c-listing-items.initialized > div',
      );
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: null,
    domain: 'selfridges.com',
    zipcode: '',
  },
  implementation,
};
