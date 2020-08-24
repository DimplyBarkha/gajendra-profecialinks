
module.exports = {
  parameterValues: {
    domain: 'superdrug.com',
    country: 'UK',
    store: 'superdrug',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    async function getRatings () {
      const productId = window.location.pathname.match(/[^\/]+$/)[0];
      const API = `https://api.bazaarvoice.com/data/batch.json?passkey=i5l22ijc8h1i27z39g9iltwo3&apiversion=5.5&displaycode=10798-en_gb&resource.q1=statistics&filter.q1=productid:eq:${productId}&filter.q1=contentlocale:eq:en_GB,en_US&stats.q1=reviews&filter_reviews.q1=contentlocale:eq:en_GB,en_US&filter_reviewcomments.q1=contentlocale:eq:en_GB,en_US&limit.q1=1`;
      const response = await fetch(API);
      const data = await response.json();
      const rating = data?.BatchedResults.q1.Results[0]?.ProductStatistics?.ReviewStatistics?.AverageOverallRating || 0;
      const ratingCount = data?.BatchedResults?.q1?.Results[0]?.ProductStatistics?.ReviewStatistics?.TotalReviewCount;
      if(!ratingCount) return;
      document.body.setAttribute('rating', (Math.round(rating * 10) / 10).toString());
      document.body.setAttribute('rating-count', ratingCount);
    }
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
    const productPage = await context.evaluate(function () {
      return Boolean(document.querySelector('body[data-page-id="productDetails"]'));
    });
    if (productPage) {
      await context.waitForFunction(() => {
        return document.querySelector('span[itemprop="reviewCount"]').textContent;
      });
    }
    await context.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    await context.evaluate(getRatings);
  },
};
