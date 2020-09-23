module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform: null,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const ratingStars = document.evaluate('//span[contains(@class, "star_js")]//@class', document, null, XPathResult.ANY_TYPE);
        const dataParams = document.evaluate('//div[contains(@class, "js--subcategory-product-item")]/@data-params', document, null, XPathResult.ANY_TYPE);
        const productURLs = document.evaluate('//div[contains(@class, "wrap-img")]//a/@href', document, null, XPathResult.ANY_TYPE);
        const reviews = document.evaluate('//div[@class = "opinions"]', document, null, XPathResult.ANY_TYPE);
        const thumbnails = document.evaluate('//div[contains(@class, "wrap-img")]//img/@data-src', document, null, XPathResult.ANY_TYPE);

        let rating, ratingIndex = 1, averageRating = 5, productRatings = [],
          parameters = [], isStarSelected = false, urls = [], reviewText = [], images = [];

        while (rating = ratingStars.iterateNext()) {
          if (rating.nodeValue.includes("selected"))
            isStarSelected = true
          if (rating.nodeValue.includes("half"))
            averageRating -= 0.5;
          else
            !isStarSelected && averageRating--;
          if (ratingIndex === 5) {
            productRatings.push(averageRating.toString().replace(".", ","));
            parameters.push(JSON.parse(dataParams.iterateNext().nodeValue));
            urls.push(productURLs.iterateNext().nodeValue);
            images.push(thumbnails.iterateNext().nodeValue);
            let rev = reviews.iterateNext();
            reviewText.push(rev && rev.innerText);
            isStarSelected = false;
            ratingIndex = 0;
            averageRating = 5;
          }
          ratingIndex++;
        }
        let reviewIndex = 0;
        productRatings.forEach((rating, index) => {
          addHiddenDiv('import_average_rating', rating);
          addHiddenDiv('import_product_brandName', parameters[index].brandName);
          addHiddenDiv('import_product_id', parameters[index].id);
          addHiddenDiv('import_product_name', parameters[index].shortName);
          addHiddenDiv('import_product_price', parameters[index].price);
          addHiddenDiv('import_product_rank', index + 1);
          addHiddenDiv('import_product_reviews', rating ? reviewText[reviewIndex++] : "");
          addHiddenDiv('import_product_thumbnail', images[index]);
          addHiddenDiv('import_product_url', urls[index]);
        })
      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data);
  }
};
