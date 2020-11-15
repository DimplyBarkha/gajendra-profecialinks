const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GB',
    store: 'very',
    transform,
    domain: 'very.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails, transform }) => {

    try {
      await context.click('#tab-link-products');
    }
    catch (error) {
      console.log(error);
    }
    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('li.product');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
      const productRatings = document.querySelectorAll('a.productRating');
      if (productRatings) {
        for (let x = 0; productRatings.length > x; x++) {
          // @ts-ignore
          const newRating = productRatings[x].title;
          // @ts-ignore
          productRatings[x].title = newRating;
        }
      }
      for (let i = 0; i < allProducts.length; i++) {
        if (!document.querySelectorAll('li.product')[i].querySelector('div.reviewsScore>div>ul')) {
          continue;
        }
        const ratings = document.querySelectorAll('li.product')[i].querySelector('div.reviewsScore>div>ul');
        let value = 0;
        for (let j = 0; j < 5; j++) {
          const stars = parseInt(ratings.querySelectorAll('li')[j].querySelector('span.starCount').innerText);
          console.log('stars=', stars);
          value += stars;
          console.log('value=', value);
        }
        document.querySelectorAll('li.product')[i].setAttribute('ratingCount', `${value}`);
      }
      allProducts.forEach((product) => {
        const div = document.createElement('div');
        div.classList.add('ratingNumber');
        const element = product.querySelector('.bvReviewStars a.productRating');
        const ratingNumber = element ? element.getAttribute('title').match(/\d?.?\d/)[0] : "";
        div.innerHTML = ratingNumber;
        product.appendChild(div);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
