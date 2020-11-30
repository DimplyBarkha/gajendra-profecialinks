const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntraMweb',
    transform,
    domain: 'myntra.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('ul.results-base li.product-base');
      for (let i = 0; i < products.length; i++) {
        const ProductBrand = products[i].querySelector('h3.product-brand');
        const productBrandTxt = ProductBrand ? ProductBrand.textContent : '';
        const productName = products[i].querySelector('h4.product-product');
        const productNameText = productName ? productName.textContent : '';
        const fullProductName = productBrandTxt && productNameText ? productBrandTxt + ' ' + productNameText : '';
        if (fullProductName) products[i].setAttribute('fullproductname', fullProductName);
        const aggRating = products[i].querySelector('div.product-ratingsContainer span:nth-child(1)') ? products[i].querySelector('div.product-ratingsContainer span:nth-child(1)').textContent : '';
        if (aggRating) products[i].setAttribute('aggrating', aggRating);
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
