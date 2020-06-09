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
  await context.evaluate(() => {
    // @ts-ignore
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("article[class*='product')] span[class*='name']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // const product = document.querySelectorAll("section[id*='san_resultSection'] article[class*='product')]");
    // var elmnt = document.getElementById("footer[id*='footer']");
    // elmnt.scrollIntoView();
    const product = document.querySelectorAll("script[type*='application/ld+json']");
    for (let i = 0; i < product.length; i++) {
      // @ts-ignore
      product[i] = (product[i]) ? JSON.parse(product[i]) : '';
      if (product[i]) {
        // @ts-ignore
        const aggregateRating = (product[i].aggregateRating && product[i].aggregateRating[0].ratingValue) ? product[i].aggregateRating[0].ratingValue : '';
        // @ts-ignore
        const reviewCount = (product[i].aggregateRating && product[i].aggregateRating[0].reviewCount) ? product[i].aggregateRating[0].reviewCount : '';
        // @ts-ignore
        const price = (product[i].offers && product[i].offers[0].price) ? product[i].offers[0].price : '';
        const url = window.location.href;
        if (aggregateRating) addHiddenDiv('ii_aggregateRating', aggregateRating, i);
        if (reviewCount) addHiddenDiv('ii_reviewCount', reviewCount, i);
        if (price) addHiddenDiv('ii_price', price, i);
        if (url) addHiddenDiv('ii_url', url, i);
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
