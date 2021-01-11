// @ts-nocheck
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    transform,
    domain: 'donaghybros.ie',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    let pagePresent= await context.evaluate(function () {
    if(document.querySelector('div[class*="page-title"] h1')){
      if(document.querySelector('div[class*="page-title"] h1').innerText.includes('404 Not Found'))
          return false;
  }
  return true;
  });
    if(pagePresent===true){
    await context.waitForNavigation({ timeout: 100000, waitUntil: 'networkidle0' });
    await context.evaluate(function () {
      console.log('Scrolling to the bottom of page.');
      document.querySelector('footer.container').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });

    try {
      await context.waitForSelector('#flix-std-inpage', { timeout: 10000 });
    } catch (err) {
      console.log('Enhanced content did not load');
    }
    await context.evaluate(async function () {
      const categoryArr = dataLayer[3].ecommerce.detail.products[0].category.split('/');
      categoryArr.map(ele => {
        const newlink = document.createElement('a');
        newlink.setAttribute('class', 'append_category');
        newlink.setAttribute('href', ele);
        document.body.appendChild(newlink);
      });

      fetch('https://api.reviews.co.uk/merchant/latest?store=donaghy-bros&branch=').then(res => {
        return res.json();
      })
        .then(ele => {
          console.log('rating');
          const reviewCount = ele.stats.total_reviews;
          const rating = ele.stats.average_rating;
          document.body.setAttribute('review_count', reviewCount);
          document.body.setAttribute('rating', rating);
        });

      const video = document.querySelector('div.fullJwPlayerWarp > div > input') ? document.querySelector('div.fullJwPlayerWarp > div > input').getAttribute('value') : '';
      const videoUrl = video.replace(new RegExp('(.+"file":")(.+.mp4)(.+)', 'g'), '$2').replace(/\\/gi, '').replace(/\/\//gi, '');
      document.body.setAttribute('video', videoUrl);
    });
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    
    return await context.extract(productDetails, { transform });
  }
  },
};
