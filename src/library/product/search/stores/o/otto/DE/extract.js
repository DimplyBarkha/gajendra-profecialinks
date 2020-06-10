async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    // @ts-ignore
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("article[class*='product'] span[class*='name']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    const product = document.querySelectorAll("script[type*='application/ld+json']");
    for (let i = 0; i < product.length; i++) {
      // @ts-ignore
      const node = (product[i]) ? JSON.parse(product[i].innerText) : '';
      if (node) {
        // @ts-ignore
        const aggregateRating = (node.aggregateRating && node.aggregateRating[0].ratingValue) ? node.aggregateRating[0].ratingValue : '';
        // @ts-ignore
        const reviewCount = (node.aggregateRating && node.aggregateRating[0].reviewCount) ? node.aggregateRating[0].reviewCount : '';
        // @ts-ignore
        const price = (node.offers && node.offers[0].price) ? node.offers[0].price : '';
        const url = window.location.href;
        if (aggregateRating) {
          addHiddenDiv('ii_aggregateRating', aggregateRating, i);
        };
        if (reviewCount) {
          addHiddenDiv('ii_reviewCount', reviewCount, i);
        };
        if (price) {
          addHiddenDiv('ii_price', price, i);
        };
        if (url) {
          addHiddenDiv('ii_url', url, i);
        };
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    transform: null,
    domain: 'otto.de',
  },
  implementation,
};
