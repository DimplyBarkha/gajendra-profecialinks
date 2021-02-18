async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    const id = location.href.split('/')[5];
    console.log(id);
    const url = `https://www.woolworths.com.au/apis/ui/Product/Review?stockcode=${id}&pageNumber=1&pageSize=100&sortType=Latest`;
    const productDetailsRequestLink = `https://www.woolworths.com.au/apis/ui/product/detail/${id}`
    const productDetailsResponse = await fetch(productDetailsRequestLink).then(res => res.json())

    const response = await fetch(url).then(res => res.json())

    const { Reviews } = response;
    console.log(Reviews);
    const { Product } = productDetailsResponse;
    console.log(Product);
    function addHiddenDiv (className, content, product) {
      const div = document.createElement('div');
      div.classList.add(className)
      div.innerText = content
      div.style.display = 'none';
      product.appendChild(div);
    }

    if (Reviews) {
      Reviews.forEach(item => {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('reviewCard')
        document.body.appendChild(reviewCard);

        addHiddenDiv('helper-review-text', item.Body, reviewCard)
        addHiddenDiv('helper-review-date', item.CreatedDate, reviewCard)
        addHiddenDiv('helper-review-rating', item.Rating, reviewCard)
        addHiddenDiv('helper-review-member', item.Member, reviewCard)
        addHiddenDiv('helper-review-source', item.Source, reviewCard)
        addHiddenDiv('helper-review-brand', Product.Brand, reviewCard)
        addHiddenDiv('helper-review-name', Product['Name'], reviewCard)
        addHiddenDiv('helper-review-sku', Product.Stockcode, reviewCard)
        addHiddenDiv('helper-review-gtin', Product.Barcode, reviewCard)
        addHiddenDiv('helper-review-average', Product.Rating.Average, reviewCard)
        addHiddenDiv('helper-review-url', location.href, reviewCard)
      })
    }

  });

  return await context.extract(productReviews);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    transform: null,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
  implementation
};
