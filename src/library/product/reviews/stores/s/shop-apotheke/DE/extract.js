
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform: null,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
  implementation: async function(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(async function() {
      let productInfo = document.querySelector('#gtm-data-layer-snippet') ? document.querySelector('#gtm-data-layer-snippet').innerText : '';
      let productId;

      if (productInfo) {
        productInfo = productInfo.replace('var dataLayer = window.dataLayer = ', '');
        productInfo = productInfo.slice(0, -1);
        productInfo = JSON.parse(productInfo);
        productId = productInfo[0].request.product;
        const newInfoEl = document.createElement('import-info');
        newInfoEl.setAttribute('brand', productInfo[0].product.brand);
        newInfoEl.setAttribute('name', productInfo[0].product.name);
        newInfoEl.setAttribute('sku', productId);
        let ratingValue = document.evaluate(`//span[contains(@class, 'o-ProductRatingOverview__averageRating')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (ratingValue.snapshotLength) {
          ratingValue = ratingValue.snapshotItem(0).innerText.replace(',', '.');
          newInfoEl.setAttribute('rating', ratingValue);
        }
        
        document.body.appendChild(newInfoEl);
      }

      if (productId) {
        let url = `https://www.shop-apotheke.com/webclient/api/cacheable/de/ratings/v2/com/product/${productId}`;
        let reviewAPI = await fetch(`${url}?page=1`);
        let totalPages = 0;

        if (reviewAPI.status === 200) {
          let reviewData = await reviewAPI.json();
          totalPages = reviewData.totalPages ? reviewData.totalPages : 0;
          const validityDate = new Date();
          validityDate.setMonth(validityDate.getMonth() - 1 );
          let gotUnrequiredReview = false;

          for (let i = 1; i <= totalPages; i++) {
            if (gotUnrequiredReview) {
              break;
            }

            reviewAPI = await fetch(`${url}?page=${i}`);
            reviewData = await reviewAPI.json();

            for (const reviewItem of reviewData.ratings) {
              let reviewDate = new Date(reviewItem.date);

              if (validityDate.getTime() > reviewDate.getTime()) {
                gotUnrequiredReview = true;
                break;
              } else {
                if (!document.querySelector('import-container')) {
                  const containerEl = document.createElement('import-container');
                  document.body.appendChild(containerEl);
                }

                const reviewMonth = (reviewDate.getMonth() + 1) < 10 ? `0${reviewDate.getMonth() + 1}` : reviewDate.getMonth() + 1;
                const reviewFullDate = (reviewDate.getDate()) < 10 ? `0${reviewDate.getDate() }` : reviewDate.getDate();
                reviewDate = `${reviewDate.getFullYear()}-${reviewMonth}-${reviewFullDate}`;
                const reviewTitle = reviewItem.title;
                const reviewContent = reviewItem.text;
                const helpfulCount = reviewItem.feedbackPositive;
                const reviewRating = reviewItem.rating;
                const newEl = document.createElement('import-review');
                newEl.innerText = reviewContent;
                newEl.setAttribute('import-title', reviewTitle);
                newEl.setAttribute('import-date', reviewDate);
                newEl.setAttribute('import-helpful-count', helpfulCount);
                newEl.setAttribute('import-rating', reviewRating);
                newEl.setAttribute('import-author', reviewItem.author);
                const holder = document.querySelector('import-container');
                holder.appendChild(newEl);
              }
            }
          }
        }
      }
    });
    const { productReviews } = dependencies;
    return await context.extract(productReviews);
  },  
};