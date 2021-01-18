const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const scrollFunc = await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      // await stall(2500);
      // await new Promise(resolve => setTimeout(resolve, 5000));
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('SCROLLING');
      if (scrollTop === 20000) {
        break;
      }
    }
  });

  const singleProdCheck = await context.evaluate(async function () {
    function addHiddenDiv (id, content, attribute, attributeValue, aTag = false, reg = false) {
      const newDiv = document.createElement('div');
      const newA = document.createElement('a');
      const recordDiv = document.querySelector('div[data-comp="ProductGrid"]');
      const recordADiv = document.querySelector('div[data-comp="ProductGrid"] a');

      if (attribute) {
        newDiv.setAttribute(attribute, attributeValue);
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      } else if (aTag) {
        recordDiv.appendChild(newA);
      } else if (reg) {
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      } else {
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        recordADiv.appendChild(newDiv);
      }
    }

    const recordADiv = document.querySelector('div[data-comp="ProductGrid "] a');
    if (!recordADiv) {
      const xpathCheck = '//div[contains(@data-comp, "ProductGrid")]//a';
      var checkElement = document.evaluate(xpathCheck, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (checkElement.snapshotLength === 0) {
        addHiddenDiv('ii_hello', ' wuba', 'data-comp', 'ProductGrid');
        addHiddenDiv('ii_aTag', ' wuba', null, null, true);
      }

      const brand = '//h1/a[contains(@data-comp,"Link Box")]/span';
      const price = '//div[contains(@data-comp,"Price Box")]/span[last()]';
      const image = '(//div[contains(@data-comp, "Carousel")]//img/@src)[1]';
      // let aggregateRating = '//a[contains(@data-comp,"RatingsSummary Flex Box")]//@aria-label'
      const aggregateRating = '(//div[contains(@data-comp,"ReviewsStats")]//div//div[contains(.,"/")])[1]';
      // let reviews = '//a[contains(@data-comp, "RatingsSummary Flex Box")]/span'
      const reviews = '//div[contains(@data-comp,"ReviewsStats")]//div[contains(.,"review")]';
      const url = '//div[@id="ii_url"]';
      const listPrice = '//span[@data-at="price"]';
      const name = '//h1[contains(@data-comp, "DisplayName")]/span';

      addHiddenDiv('ii_url', window.location.href);
      var brandElement = document.evaluate(brand, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (brandElement.snapshotLength > 0) {
        for (let i = 0; i < brandElement.snapshotLength; i++) {
          addHiddenDiv('ii_brand', `${brandElement.snapshotItem(i).textContent}`);
        }
      }
      var priceElement = document.evaluate(price, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (priceElement.snapshotLength > 0) {
        for (let i = 0; i < priceElement.snapshotLength; i++) {
          addHiddenDiv('ii_price', `${priceElement.snapshotItem(i).textContent}`);
        }
      }
      var imageElement = document.evaluate(image, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (imageElement.snapshotLength > 0) {
        for (let i = 0; i < imageElement.snapshotLength; i++) {
          addHiddenDiv('ii_image', `https://www.sephora.com/${imageElement.snapshotItem(i).textContent}`);
        }
      }
      var aggregateRatingElement = document.evaluate(aggregateRating, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (aggregateRatingElement.snapshotLength > 0) {
        for (let i = 0; i < aggregateRatingElement.snapshotLength; i++) {
          const rating = aggregateRatingElement.snapshotItem(i).textContent.split(' ');
          if (rating[0]) {
            addHiddenDiv('ii_aggregateRating', `${rating[0]}`);
          }
          addHiddenDiv('ii_aggregateRatingText', `${aggregateRatingElement.snapshotItem(i).textContent}`);
        }
      }
      var reviewsElement = document.evaluate(reviews, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (reviewsElement.snapshotLength > 0) {
        for (let i = 0; i < reviewsElement.snapshotLength; i++) {
          const rating = reviewsElement.snapshotItem(i).textContent.split(' ');
          if (rating[0]) {
            addHiddenDiv('ii_reviews', `${rating[0]}`);
          }
        }
      }
      var urlElement = document.evaluate(url, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (urlElement.snapshotLength > 0) {
        for (let i = 0; i < urlElement.snapshotLength; i++) {
          const sku = urlElement.snapshotItem(i).textContent;
          const splits = sku.split('skuId=');
          if (splits[1]) {
            const half = splits[1];
            const last = half.split('&');
            if (last[0]) {
              addHiddenDiv('ii_sku', `${last[0]}`);
            }
          }
        }
      }
      var listPriceElement = document.evaluate(listPrice, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (listPriceElement.snapshotLength > 0) {
        for (let i = 0; i < listPriceElement.snapshotLength; i++) {
          const lPrice = listPriceElement.snapshotItem(i).textContent.match(/[+-]?\d+(,d{3})*(\.\d+)?(e[+-]?\d+)?/g);
          if (lPrice[0]) {
            addHiddenDiv('ii_listPrice', `${lPrice[0]}`);
          }
        }
      }
      var nameElement = document.evaluate(name, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (nameElement.snapshotLength > 0) {
        for (let i = 0; i < nameElement.snapshotLength; i++) {
          addHiddenDiv('ii_name', `${nameElement.snapshotItem(i).textContent}`);
        }
      }
      return true;
    } else {
      return false;
    }
  });
  if (!singleProdCheck) {
    const ratingArr = await context.evaluate(async function getEnhancedContent () {
      const objArray = [];
      const ratingArray = [];
      const keywordStr = document.querySelector('h1 strong[data-at="search_keyword"]');
      let keyword;
      if (keywordStr) {
        keyword = keywordStr.innerText.replace(/“/g, '').replace(/”/g, '');
      }

      async function fetchRetry (url, n) {
        function handleErrors (response) {
          if (response.status === 200) {
            return response;
          } else {
            console.log('FETCH FAILED');
            if (n === 1) return 'Nothing Found';
            return fetchRetry(url, n - 1);
          }
        }
        const fetched = fetch(url).then(handleErrors).then(response => response.text()).catch(function (error) {
          console.log('FETCH FAILED');
          if (n === 1) return 'Nothing Found';
          return fetchRetry(url, n - 1);
        });

        return fetched;
      }
      if (keyword) {
        const fetch1 = JSON.parse(await fetchRetry(`https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=1`, 10));
        const fetch2 = JSON.parse(await fetchRetry(`https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=2`, 10));
        const fetch3 = JSON.parse(await fetchRetry(`https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=3`, 10));
        objArray.push(fetch1), objArray.push(fetch2), objArray.push(fetch3);
        for (let i = 0; i < objArray.length; i++) {
          objArray[i].products.forEach(product => {
            const rating = product.rating;
            const ratingFloat = parseFloat(rating);
            const adjusted = ratingFloat.toPrecision(2);
            if (ratingArray.length < 150) {
              ratingArray.push(adjusted);
            }
          });
        }
      }
      return ratingArray;
    });

    await context.evaluate(function (ratings) {
      const products = document.querySelectorAll('div[data-comp="ProductGrid "] a');
      if (products) {
        for (let i = 0; i < products.length; i++) {
          const newDiv = document.createElement('div');
          newDiv.id = 'ii_aggregateRating';
          newDiv.textContent = ratings[i];
          newDiv.style.display = 'block';
          products[i].appendChild(newDiv);
        }
      }
    }, ratingArr);
  }

  return await context.extract(productDetails, { transform });
}
