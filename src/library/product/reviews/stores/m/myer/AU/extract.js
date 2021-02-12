async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  await context.evaluate(async () => {
    function addHiddenDiv(className, content, block) {
      const div = document.createElement('div');
      div.classList.add(className);
      div.innerText = content;
      div.style.display = 'none';
      block.appendChild(div);
    }
    const id = document.querySelector('div.rating_summary_container').getAttribute('data-bv-product-id');
    const url = `https://api.bazaarvoice.com/data/batch.json?passkey=ca8SY5moeA6YSyJwnpgXywHYGpPI4RF3z8c1Y9Hbewg7s&apiversion=5.5&displaycode=18766-en_au&resource.q0=products&filter.q0=id%3Aeq%3A${id}&stats.q0=reviews&filteredstats.q0=reviews&filter_reviews.q0=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&filter_reviewcomments.q0=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&resource.q1=reviews&filter.q1=isratingsonly%3Aeq%3Afalse&filter.q1=productid%3Aeq%3A${id}&filter.q1=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&sort.q1=submissiontime%3Adesc&stats.q1=reviews&filteredstats.q1=reviews&include.q1=authors%2Cproducts%2Ccomments&filter_reviews.q1=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&filter_reviewcomments.q1=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&filter_comments.q1=contentlocale%3Aeq%3Aen_AU%2Cen_US%2Cen_CA%2Cen_GB%2Cen_NO%2Cen_NZ%2Cen_DK%2Cen_HK%2Cen_AE%2Cen_ID%2Cen_IN%2Cen_SG%2Cen_TH%2Cen_IE%2Cen_ZA%2Cen_SA&limit.q1=100&offset.q1=0&limit_comments.q1=3`;

    async function getReviews() {
      return fetch(url).then(res => res.json()).then(res2 => res2.BatchedResults);
    }
    const reviews = await getReviews();

    const brandText = reviews.q1.Includes.Products[id].Brand.Name;
    const productName = reviews.q1.Includes.Products[id].Name;
    const productStoreCode = document.querySelector('p[data-automation="product-part-number"] > span').textContent;
    const productUrl = reviews.q1.Includes.Products[id].ProductPageUrl;

    reviews.q1.Results.forEach(review => {
      const block = document.createElement('div');
      block.classList.add('reviewBlock');
      document.body.appendChild(block);

      const reviewText = review.ReviewText;
      const helpfull = review.Helpfulness ? review.Helpfulness : 0;
      const date = Date.parse(review.SubmissionTime);
      const reviewRating = review.Rating;
      const reviewTitle = review.Title;
      const user = review.UserNickname;

      addHiddenDiv('helper-reviewText', reviewText, block);
      addHiddenDiv('helper-helpfull', helpfull, block);
      addHiddenDiv('helper-brand', brandText, block);
      addHiddenDiv('helper-name', productName, block);
      addHiddenDiv('helper-sku', productStoreCode, block);
      addHiddenDiv('helper-date', date, block);
      addHiddenDiv('helper-rating', reviewRating, block);
      addHiddenDiv('helper-title', reviewTitle, block);
      addHiddenDiv('helper-url', productUrl, block);
      addHiddenDiv('helper-user', user, block);
    });
    console.log(reviews);
  });
  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: null,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation,
};
