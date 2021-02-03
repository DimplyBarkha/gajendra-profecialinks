const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    transform,
    domain: 'bipa.at',
  },
  implementation: async (
    { id },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(async () => {
      const cookieButton = document.querySelector('#onetrust-accept-btn-handler');
      if (cookieButton) {
        // @ts-ignore
        await cookieButton.click();
      }
      const idDom = document.querySelector('.pdp__cockpit > div > script');
      const regex = /(?<=productId = ").+?(?=")/;
      const productId = idDom.textContent.match(regex);
      const container = document.querySelector('.pdp__wrapper--content');
      const fetchedData = await fetch(`https://api.bazaarvoice.com/data/batch.json?passkey=314sirroznw8c3mi5p4i4nqx0&apiversion=5.5&displaycode=19038-de_at&resource.q0=products&filter.q0=id%3Aeq%3A${productId}&stats.q0=reviews&filteredstats.q0=reviews&filter_reviews.q0=contentlocale%3Aeq%3Ade*%2Cde_AT&filter_reviewcomments.q0=contentlocale%3Aeq%3Ade*%2Cde_AT&resource.q1=reviews&filter.q1=isratingsonly%3Aeq%3Afalse&filter.q1=productid%3Aeq%3A${productId}&filter.q1=contentlocale%3Aeq%3Ade*%2Cde_AT&sort.q1=relevancy%3Aa1&stats.q1=reviews&filteredstats.q1=reviews&include.q1=authors%2Cproducts%2Ccomments&filter_reviews.q1=contentlocale%3Aeq%3Ade*%2Cde_AT&filter_reviewcomments.q1=contentlocale%3Aeq%3Ade*%2Cde_AT&filter_comments.q1=contentlocale%3Aeq%3Ade*%2Cde_AT&limit.q1=2&offset.q1=0&limit_comments.q1=3&resource.q2=reviews&filter.q2=productid%3Aeq%3A${productId}&filter.q2=contentlocale%3Aeq%3Ade*%2Cde_AT&limit.q2=1&resource.q3=reviews&filter.q3=productid%3Aeq%3A${productId}&filter.q3=isratingsonly%3Aeq%3Afalse&filter.q3=issyndicated%3Aeq%3Afalse&filter.q3=rating%3Agt%3A3&filter.q3=totalpositivefeedbackcount%3Agte%3A3&filter.q3=contentlocale%3Aeq%3Ade*%2Cde_AT&sort.q3=totalpositivefeedbackcount%3Adesc&include.q3=authors%2Creviews%2Cproducts&filter_reviews.q3=contentlocale%3Aeq%3Ade*%2Cde_AT&limit.q3=1&resource.q4=reviews&filter.q4=productid%3Aeq%3A${productId}&filter.q4=isratingsonly%3Aeq%3Afalse&filter.q4=issyndicated%3Aeq%3Afalse&filter.q4=rating%3Alte%3A3&filter.q4=totalpositivefeedbackcount%3Agte%3A3&filter.q4=contentlocale%3Aeq%3Ade*%2Cde_AT&sort.q4=totalpositivefeedbackcount%3Adesc&include.q4=authors%2Creviews%2Cproducts&filter_reviews.q4=contentlocale%3Aeq%3Ade*%2Cde_AT&limit.q4=1`).then(res => res.json());
      const roundFunction = (numb) => {
        const secondDecimalPlace = numb.toString().slice(2,3)
        const thirdDecimalPlace = numb.toString().slice(3, 4);
        if ( Number(secondDecimalPlace) + 1 >= 5 && thirdDecimalPlace !== 0 ) {
          const numbRounded = numb + 0.1;
          return numbRounded;
        }
        return numb;
      };
      if (fetchedData) {
        const rating = fetchedData.BatchedResults.q0.Results[0].ReviewStatistics.AverageOverallRating;
        const ratingCount = fetchedData.BatchedResults.q0.Results[0].ReviewStatistics.TotalReviewCount;

        if (rating) {
          const ratingFormatted = roundFunction(rating).toString().replace('.', ',').slice(0, 3);
          container.setAttribute('ratingExtracted', ratingFormatted);
        }
        if(ratingCount) {
          container.setAttribute('ratingCount', ratingCount)
        }
      }
    });
    await context.evaluate(async () => {
      const zoom = document.querySelector('.magnifyframe');

      if (zoom) {
        zoom.setAttribute('zoom', 'yes');
      }
    });
    await context.extract(productDetails, { transform });
  },
};
