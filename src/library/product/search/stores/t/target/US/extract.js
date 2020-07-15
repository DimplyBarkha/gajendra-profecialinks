
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

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

    function getProductData(data) {
      if (data && data.search_response && data.search_response.items && data.search_response.items.Item && data.search_response.items.Item.length) {
        for(let product of data.search_response.items.Item) {

          if(productNames.includes(product.title) || productNames.length === 150) {
            continue;
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
            addHiddenDiv(newDiv, 'averageRating', product.average_rating);
          }
          if (product.total_reviews && product.total_reviews > 0) {
            addHiddenDiv(newDiv, 'reviewCount', product.total_reviews);
          }
          if (product.price && product.price.current_retail) {
            addHiddenDiv(newDiv, 'price', product.price.current_retail);
          }
          if (product.brand) {
            addHiddenDiv(newDiv, 'brand', decodeHtml(product.brand));
          }

          productNames.push(product.title);

        }
      }
      console.log('arraylength', productNames.length);
    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
    const splitUrl = window.location.href.split('?');
    const splitVars = splitUrl[1].split('&');
    const keywords = splitVars[0];
    const productNames = [];
    console.log('keywords', keywords);
    await fetch('https://redsky.target.com/v2/plp/search/?channel=web&count=96&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&' + keywords + '&offset=0&pricing_store_id=1465&store_ids=1465%2C872%2C896%2C611%2C354&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
    .then(data => data.json())
    .then(res => {
      getProductData(res);
      if(res && res.search_response && res.search_response.metaData) {
        const maxResults = res.search_response.metaData.filter(obj => obj.name === "total_results")[0];
        console.log('maxResults', maxResults.value);
        if (res && res.search_response && maxResults.value > 96) {
          getSecondIteration();
        }
      }
    });

    async function getSecondIteration() {
      await fetch('https://redsky.target.com/v2/plp/search/?channel=web&count=96&default_purchasability_filter=true&facet_recovery=false&fulfillment_test_mode=grocery_opu_team_member_test&isDLP=false&' + keywords + '&offset=96&pricing_store_id=1465&store_ids=1465%2C872%2C896%2C611%2C354&visitorId=01722EF48EF50201B636E4B69E84817D&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_6%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F83.0.4103.116+Safari%2F537.36&excludes=available_to_promise_qualitative%2Cavailable_to_promise_location_qualitative&key=eb2551e4accc14f38cc42d32fbc2b2ea')
      .then(data => data.json())
      .then(res => {
        getProductData(res);
      });
    }

    /*const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
    let tcins = [];
    let data = JSON.parse(document.body.innerText);
    if (data && data.search_response && data.search_response.items && data.search_response.items.Item) {
      for(let product of data.search_response.items.Item) {

        if(!product.tcin) {
          continue;
        }

        const newDiv = createListItem();

        addHiddenDiv(newDiv, 'productId', product.tcin);
        tcins.push(product.tcin);

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
          addHiddenDiv(newDiv, 'averageRating', product.average_rating);
        }
        if (product.total_reviews && product.total_reviews > 0) {
          addHiddenDiv(newDiv, 'reviewCount', product.total_reviews);
        }
        if (product.price && product.price.current_retail) {
          addHiddenDiv(newDiv, 'price', product.price.current_retail);
        }
        if (product.brand) {
          addHiddenDiv(newDiv, 'brand', decodeHtml(product.brand));
        }
      }
    }*/

    /*const productNames = [];
    document.querySelectorAll('td.Item.depth_2>table>tbody>tr').forEach((e, ind) => {

      const baseUrl = e.querySelector('.base_url.depth_4') ? e.querySelector('.base_url.depth_4').innerText : '';
      const imageUrl = e.querySelector('.primary.depth_4') ? e.querySelector('.primary.depth_4').innerText : '';
      if (baseUrl.length && imageUrl.length) {
        addHiddenDiv(e, 'thumbnail', baseUrl + imageUrl);
      }

      const title = e.querySelector('.title').innerText;
      addHiddenDiv(e, 'title', title);
      productNames.push(title);

      const productUrl = e.querySelector('.url').innerText;
      addHiddenDiv(e, 'url', 'https://www.target.com' + productUrl);
      const splitUrl = productUrl.split('-');
      addHiddenDiv(e, 'productId', splitUrl[splitUrl.length - 1].toString());

      const brand = e.querySelector('.brand.depth_3') ? e.querySelector('.brand').innerText : '';
      if (brand.length) {
        addHiddenDiv(e, 'brand', brand);
      }

      const reviewCount = e.querySelector('.total_reviews') ? e.querySelector('.total_reviews').innerText : '';
      if (reviewCount.length && reviewCount > 0) {
        addHiddenDiv(e, 'reviewCount', reviewCount);
      }

      const sponsored = e.querySelector('.is_sponsored_sku');
      if (sponsored && sponsored.innerText) {
        addHiddenDiv(e, 'sponsored', 'yes');
      }

    });*/
  });

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
