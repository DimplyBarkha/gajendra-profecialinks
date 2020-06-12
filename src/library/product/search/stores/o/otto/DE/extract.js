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
    function ratingTransformation (rating) {
      const stars = rating.split('*').length - 1;
      const slash = rating.split('/').length - 1;
      if (stars > 0 && slash > 0) {
        return stars + 0.5;
      } else if (stars > 0) {
        return stars;
      } else {
        return '';
      }
    }
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    const product = document.querySelectorAll("section[id='san_resultSection'] article[class*='product']");
    for (let i = 0; i < product.length; i++) {
      const node = product[i];
      if (node) {
        // @ts-ignore
        const aggregateRating = (node.querySelector('span[class*="stars p_rating50"]')) ? ratingTransformation(node.querySelector('span[class*="stars p_rating50"]').innerText) : '';
        // @ts-ignore
        const reviewCount = (node.querySelector('span[class*="nrOfReviews"]')) ? node.querySelector('span[class*="nrOfReviews"]').innerText.replace(/\((\d+)\)/, '$1') : '';
        // @ts-ignore
        const price = (node.querySelector("span[class*='reduce' ],span[class*='retail']")) ? node.querySelector("span[class*='reduce' ],span[class*='retail']").innerText.replace('ab ', '') : '';
        const url = window.location.href;
        if (aggregateRating) {
          addHiddenDiv('ii_aggregateRating', aggregateRating, i);
        };
        if (reviewCount) {
          addHiddenDiv('ii_reviewCount', reviewCount, i);
        };
        if (url) {
          addHiddenDiv('ii_url', url, i);
        };
        if (price) {
          addHiddenDiv('ii_price', price, i);
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
