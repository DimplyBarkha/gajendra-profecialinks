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

    const closeNewsletterBtn = await context.evaluate(async function () {
      document.querySelector('button[data-track-onclick="popupClose"]');
    });
    if (closeNewsletterBtn) {
      await context.click('button[data-track-onclick="popupClose"]');
    }
    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });

    await context.evaluate(async function () {
      let rank = localStorage.getItem('lastRank') ? Number(localStorage.getItem('lastRank')) : 1;
      let rankOrganic = localStorage.getItem('lastRankOrganic') ? Number(localStorage.getItem('lastRankOrganic')) : 1;
      const products = document.querySelectorAll('section.card article.prd');
      for (let i = 0; i < products.length; i++) {
        products[i].setAttribute('rank', `${rank + i}`);
        products[i].setAttribute('rank_organic', `${rankOrganic + i}`);
        rank++;
        const isSponsored = !!products[i].querySelector('a[data-list="sponsored"]');
        if (!isSponsored) rankOrganic++;
      }
      localStorage.setItem('lastRank', `${rank}`);
      localStorage.setItem('lastRankOrganic', `${rankOrganic}`);
    });
    return await context.extract(productDetails, { transform });
  },
};
