
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    transform: null,
    domain: 'perfecthair.ch',
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
        const products = document.evaluate('count(//div[contains(@class, "product--box")])', document, null, XPathResult.ANY_TYPE).numberValue;
        const productBrands = document.evaluate('//span[@class = "product-supplier-name"]', document, null, XPathResult.ANY_TYPE);
        const productIds = document.evaluate('//div[contains(@class, "product--box")]/@data-ordernumber', document, null, XPathResult.ANY_TYPE);
        const productImages = document.evaluate('//span[@class = "image--media"]//img/@srcset', document, null, XPathResult.ANY_TYPE);
        const productNames = document.evaluate('//a[@class = "product--title"]', document, null, XPathResult.ANY_TYPE);
        const productPrices = document.evaluate('//span[contains(@class, "price--default")]', document, null, XPathResult.ANY_TYPE);
        const productURLs = document.evaluate('//a[@class = "product--title"]/@href', document, null, XPathResult.ANY_TYPE);
        let ratings = [], brands = [], ids = [], images = [], names = [], prices = [], urls = [];
        for (let index = 1; index <= products; index++) {
          brands.push(productBrands.iterateNext().innerText);
          ids.push(productIds.iterateNext().nodeValue);
          images.push(productImages.iterateNext().nodeValue);
          names.push(productNames.iterateNext().innerText);
          prices.push(parseFloat(productPrices.iterateNext().innerText.replace(/CHF\s/, "")).toFixed(2).replace(".", ","));
          urls.push(productURLs.iterateNext().nodeValue);

          let ratingNodes = document.evaluate(`(//div[@class = "product--rating-container"])[${index}]//i/@class`, document, null, XPathResult.ANY_TYPE);
          let ratingNode, rating = 0;
          while (ratingNode = ratingNodes.iterateNext()) {
            if (ratingNode.nodeValue === "icon--star")
              rating++;
            else if (ratingNode.nodeValue === "icon--star-half")
              rating = rating + 0.5;
          }
          ratings.push(rating.toString().replace(".", ","));
        }
        ratings.forEach((rating, index) => {
          addHiddenDiv('import_average_rating', rating || "");
          addHiddenDiv('import_brand_text', brands[index]);
          addHiddenDiv('import_id', ids[index]);
          addHiddenDiv('import_image', images[index]);
          addHiddenDiv('import_name', names[index]);
          addHiddenDiv('import_price', prices[index]);
          addHiddenDiv('import_product_url', urls[index]);
          addHiddenDiv('import_product_rank', index + 1);
          addHiddenDiv('import_page_url', location.href);
        })
      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data);
  }
};
