const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    transform,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const closeNewsletterBtn = await context.evaluate(async function () {document.querySelector('button[data-track-onclick="popupClose"]')});
    if (closeNewsletterBtn){
      await context.click('button[data-track-onclick="popupClose"]');
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('section.card article.prd');
      for (let i = 0; i < products.length; i++) {
        const productCoreInfo = products[i].querySelector(' a.core');
        const productHref = productCoreInfo ? productCoreInfo.getAttribute('href') : null;
        const productUrl = productHref ? 'https://www.jumia.co.ke' + productHref : '';
        products[i].setAttribute('productUrlId', productUrl);
        const ratingCount =  products[i].querySelector('div.rev') ? products[i].querySelector('div.rev').textContent : '';
        if (ratingCount) products[i].setAttribute('ratingcount', ratingCount.replace(/^\d+\.?,?(\d+)? out of \d+\((\d+)\)/g, '$2'));
        const aggRating = products[i].querySelector('div.rev') ? products[i].querySelector('div.rev').textContent : '';
        if (aggRating) products[i].setAttribute('aggrating', aggRating.replace(/(^\d+(\.?,?\d+)?).*/g, '$1').replace('.', ','));
        const sponspored = products[i].querySelector('a.core[data-list="sponsored"]');
        if(sponspored) products[i].setAttribute('productSponsored', 'true');

        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
  
    });

    return await context.extract(productDetails, { transform });
  },
};
