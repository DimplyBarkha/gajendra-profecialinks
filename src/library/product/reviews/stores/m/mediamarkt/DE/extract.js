/* eslint-disable no-shadow */

const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;

    await context.evaluate(async () => {
      const body = document.querySelector('body');

      // gtin, sku, rating, brand, name, url
      let jsonWithGtin = document.querySelector('head > script[type="application/ld+json"]')
        ? document.querySelector('head > script[type="application/ld+json"]').textContent
        : '';
      if (jsonWithGtin) {
        jsonWithGtin = JSON.parse(jsonWithGtin);
        // @ts-ignore
        const gtin = jsonWithGtin.gtin13;
        // @ts-ignore
        const sku = jsonWithGtin.sku;
        // @ts-ignore
        const rating = jsonWithGtin.aggregateRating ? jsonWithGtin.aggregateRating.ratingValue : '';
        // @ts-ignore
        const brand = jsonWithGtin.brand ? jsonWithGtin.brand.name : '';
        // @ts-ignore
        const name = jsonWithGtin.name;
        // @ts-ignore
        const url = jsonWithGtin.url;
        body.setAttribute('productgtin', gtin);
        body.setAttribute('productsku', sku);
        body.setAttribute('productrating', rating);
        body.setAttribute('productbrand', brand);
        body.setAttribute('productname', name);
        body.setAttribute('producturl', url);
      }

      // reviews data
      const reviews = document.querySelectorAll('section#reviews div[class*="Cardstyled__StyledCardWrapper"]:not([class*="ReviewHeader"])');
      reviews.forEach(review => {
        review.setAttribute('tocollect', '');
        // review date
        const dateElement = review.querySelector('div[class*="indexstyled__StyledReviewBody"] > div > div:nth-of-type(2) > span');
        const reviewDate = dateElement ? dateElement.textContent : '';
        review.setAttribute('reviewdate', reviewDate);
        // helpful count
        const helpfulCountElement = review.querySelector('span[class*="ReviewFeedbackPositiveNegativeCount"]');
        const helpfulCount = helpfulCountElement ? helpfulCountElement.textContent : '';
        review.setAttribute('helpfulcount', helpfulCount);
        // review title
        const reviewTitleElement = review.querySelector('div[class*="indexstyled__StyledReviewBody"] > p');
        reviewTitleElement.setAttribute('reviewtitleelement', '');
        const reviewTitle = reviewTitleElement ? reviewTitleElement.textContent : '';
        review.setAttribute('reviewtitle', reviewTitle);
        // review rating
        const ratingStars = review.querySelectorAll('div[class*="Rating__StyledRatingWrapper"] > div:not([color*="grey"])');
        const rating = (ratingStars ? ratingStars.length : 0).toFixed(0);
        review.setAttribute('reviewrating', rating);
        // review text
        const expandReviewButton = review.querySelector('button[class*="StyledReviewExpandLink"]');
        // @ts-ignore
        if (expandReviewButton) expandReviewButton.click();
        const textElements = review.querySelectorAll('div[class*="StyledReviewBody"] > *[class*="Typostyled__StyledInfoTypo"]:not([reviewtitleelement])');
        let textData = '';
        textElements.forEach(textElement => {
          textData += textElement.textContent + ' ';
        });
        review.setAttribute('reviewtext', textData.trim());
        // review author
        const authorElement = review.querySelector('span[class*="StyledReviewAuthor"]');
        let author = authorElement ? authorElement.textContent : '';
        if (author.startsWith('von ')) {
          author = author.replace('von ', '').trim();
        }
        review.setAttribute('reviewauthor', author);
      });
    });

    return await context.extract(productReviews, { transform });
  },
};
