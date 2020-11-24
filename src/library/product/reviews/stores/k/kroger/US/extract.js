const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await context.evaluate(async () => {
    async function fetchReviews (productId) {
      const refURL = window.location.href;

      const fetchURL = `https://api.bazaarvoice.com/data/batch.json?passkey=caUlcVbwe5NtYPLmXx1ABJtyG2xV2363kFRlIRMTakcA8&apiversion=5.5&displaycode=10876-en_us&resource.q0=reviews&filter.q0=isratingsonly%3Aeq%3Afalse&filter.q0=productid%3Aeq%3A${productId}&filter.q0=contentlocale%3Aeq%3Aen*%2Cen_US&sort.q0=helpfulness%3Adesc%2Ctotalpositivefeedbackcount%3Adesc&stats.q0=reviews&filteredstats.q0=reviews&include.q0=authors%2Cproducts%2Ccomments&filter_reviews.q0=contentlocale%3Aeq%3Aen*%2Cen_US&filter_reviewcomments.q0=contentlocale%3Aeq%3Aen*%2Cen_US&filter_comments.q0=contentlocale%3Aeq%3Aen*%2Cen_US&limit.q0=8&offset.q0=0&limit_comments.q0=3&callback=bv_1111_13775`;
      console.log('fetchURL: ', fetchURL);

      const response = await fetch(fetchURL, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'sec-fetch-dest': 'script',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: refURL,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      });
      debugger

      if (response && response.status === 400) {
        throw new Error('Error when calling API');
      }

      if (response && response.status === 404) {
        console.log('Reviews Not Found!!!!');
      }

      if (response && response.status === 200) {
        console.log('Reviews Found!!!!');
        const data = await response.json();
        console.log(data);
        return data;
      }
      if (!response) {
        console.log('Something went wrong');
      }
    }

    const productIdEl = document.querySelector('div[data-bv-show="rating_summary"]');
    if (productIdEl) {
      const productId = productIdEl.getAttribute('data-bv-product-id');
      console.log(productId);
      await fetchReviews(productId);
      // let url = `https://api.bazaarvoice.com/data/batch.json?passkey=caUlcVbwe5NtYPLmXx1ABJtyG2xV2363kFRlIRMTakcA8&apiversion=5.5&displaycode=10876-en_us&resource.q0=reviews&filter.q0=isratingsonly%3Aeq%3Afalse&filter.q0=productid%3Aeq%3A${productId}&filter.q0=contentlocale%3Aeq%3Aen*%2Cen_US&sort.q0=helpfulness%3Adesc%2Ctotalpositivefeedbackcount%3Adesc&stats.q0=reviews&filteredstats.q0=reviews&include.q0=authors%2Cproducts%2Ccomments&filter_reviews.q0=contentlocale%3Aeq%3Aen*%2Cen_US&filter_reviewcomments.q0=contentlocale%3Aeq%3Aen*%2Cen_US&filter_comments.q0=contentlocale%3Aeq%3Aen*%2Cen_US&limit.q0=8&offset.q0=0&limit_comments.q0=3&callback=bv_1111_13775`
    }
  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
    zipcode: '',
  },
  implementation,
};
