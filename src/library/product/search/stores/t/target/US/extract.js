
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await context.evaluate(async function () {

    function addHiddenDiv (el, className, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', className);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    function decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }

    function createListItem () {
      const newDiv = document.createElement('li');
      newDiv.setAttribute('class', 'productInfo');
      newDiv.textContent = '';
      newDiv.style.display = 'none';
      document.getElementById('mainContainer').appendChild(newDiv);
      return newDiv;
    }

    let uniqueProductCount = 0;


    function getProductData(data) {
      if (data && data.search_response && data.search_response.items && data.search_response.items.Item && data.search_response.items.Item.length) {
        for(let product of data.search_response.items.Item) {

          if (productNames.length === 150) {
            break;
          }

          const newDiv = createListItem();
          addHiddenDiv(newDiv, 'productId', product.tcin);

          addHiddenDiv(newDiv, 'productName', decodeHtml(product.title));
          if (product.is_sponsored_sku) {
            addHiddenDiv(newDiv, 'sponsored', product.is_sponsored_sku);
          }
          if (product.url) {
            addHiddenDiv(newDiv, 'productUrl', 'https://www.target.com' + product.url);
          }
          if (product.upc) {
            addHiddenDiv(newDiv, 'gtin', product.upc);
          }
          if (product.images && product.images.length) {
            addHiddenDiv(newDiv, 'thumbnail', product.images[0].base_url + product.images[0].primary);
          }
          if (product.average_rating) {
            addHiddenDiv(newDiv, 'averageRating', (Math.round(product.average_rating * 10) / 10));
          }
          if (product.total_reviews && product.total_reviews > 0) {
            addHiddenDiv(newDiv, 'reviewCount', product.total_reviews);
          }
          if (product.price) {
            addHiddenDiv(newDiv, 'price', product.price.current_retail || product.price.formatted_current_price);
          }
          if (product.brand) {
            addHiddenDiv(newDiv, 'brand', decodeHtml(product.brand));
          }

          productNames.push(product.title);

        }
      }
      console.log('results', productNames.length);
    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
    const splitUrl = window.location.href.split('?');
    const splitVars = splitUrl[1].split('&');
    const keywords = splitVars[0].replace('keyword=', '').replace(' ', '+');
    const productNames = [];
    console.log('keywords', keywords);
    await fetch('https://redsky.target.com/v2/plp/search/?channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&keyword=' + keywords + '&offset=0&pageId=%2Fs%2F'+ keywords + '&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
    .then(data => data.json())
    .then(res => {
      getProductData(res);
      if(res && res.search_response && res.search_response.metaData) {
        const maxResults = res.search_response.metaData.filter(obj => obj.name === "total_results")[0];
        if (maxResults) {
          console.log('maxResults', maxResults.value);
          if (res && res.search_response && maxResults.value > 24) {
            getNextIteration(1);
          }
        } else if(res.search_response.metaData.filter(obj => obj.name === 'deep_link')[0]) {
          const deepLink = res.search_response.metaData.filter(obj => obj.name === 'deep_link')[0].value;
          const category = deepLink.split('=')[1];
          getCategoryData(category);
        }
      }
    });

    async function getNextIteration(index) {
      const offset = 24 * index;
      await fetch('https://redsky.target.com/v2/plp/search/?channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&keyword=' + keywords + '&offset=' + offset + '&pageId=%2Fs%2F'+ keywords + '&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
      .then(data => data.json())
      .then(res => {
        getProductData(res);
        if(res && res.search_response && res.search_response.metaData) {
          const maxResults = res.search_response.metaData.filter(obj => obj.name === "total_results")[0];
          if (maxResults) {
            if (res && res.search_response && maxResults.value > offset + 24 && offset < 150) {
              getNextIteration(index + 1);
            }
          }
        }
      });
    }

    async function getCategoryData(category) {
      await fetch('https://redsky.target.com/v2/plp/search/?category=' + category + '&channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&offset=0&pageId=%2Fc%2F' + category + '&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
      .then(data => data.json())
      .then(res => {
        getProductData(res);
        if(res && res.search_response && res.search_response.metaData) {
          const maxResults = res.search_response.metaData.filter(obj => obj.name === "total_results")[0];
          if (maxResults) {
            console.log('maxResults', maxResults.value);
            if (res && res.search_response && maxResults.value > 24) {
              console.log('getting second category iteration');
              getCategoryIteration(category, 1);
            }
          }
        }
      });
    }

    async function getCategoryIteration(category, index) {
      const offset = 24 * index;
      await fetch('https://redsky.target.com/v2/plp/search/?category=' + category + '&channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&offset=' + offset + '&pageId=%2Fc%2F' + category + '&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
      .then(data => data.json())
      .then(res => {
        getProductData(res);
        if(res && res.search_response && res.search_response.metaData) {
          const maxResults = res.search_response.metaData.filter(obj => obj.name === "total_results")[0];
          if (maxResults) {
            if (res && res.search_response && maxResults.value > offset + 24 && offset < 150) {
              getCategoryIteration(category, index + 1);
            }
          }
        }
      });
    }

  });

  await stall(20000);

  let extract = await context.extract(productDetails, { transform });

  return [];


}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
