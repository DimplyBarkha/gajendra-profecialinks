
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

  const storeId = await context.evaluate(async function() {
    return document.getElementById('storeId') ? document.getElementById('storeId').innerText : "";
  });

  const postalCode = await context.evaluate(async function() {
    return document.getElementById('zipCode') ? document.getElementById('zipCode').innerText : "";
  });

  const currentUrl = await context.evaluate(function() {
    return window.location.href;
  });

  await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  const productId = await context.evaluate(function() {

      const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
      if (link !== null) {
        const href = link.getAttribute('href');
        if (href.indexOf('?preselect=') > -1) {
          const splitUrl = href.split('-');
          const endOfUrl = splitUrl[splitUrl.length - 1];
          let productId = endOfUrl.split('?preselect=')[0];
          return productId;
        }
      }

    return window.location.href.split('=')[1];
  });

  await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  const productUrl = await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(100);
    const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
    if (link !== null) {
      const href = link.getAttribute('href');
      if (href.indexOf('preselect=') > -1) {
        let productId = href.split('preselect=')[1];
        productId = productId.split('#')[0];
        const splitUrl = href.split('-');
        splitUrl[splitUrl.length - 1] = productId;
        return splitUrl.join('-');
      }
      return href;
    }
  });

  await context.goto('https://redsky.target.com/v3/stores/nearby/' + postalCode + '?key=eb2551e4accc14f38cc42d32fbc2b2ea&limit=20&within=100&unit=mile',  { timeout: 30000, waitUntil: 'load', checkBlocked: true });

  const locationData = await context.evaluate(function(storeId) {
    let driveAddress = '';
    let drive = '';
    let onlineStore = '';
    const data = JSON.parse(document.body.innerText);
    if (data && data.length && data[0].locations) {
      const filterStores = data[0].locations.filter(store => store.location_id === Number(storeId));
      if (filterStores.length) {
        if (filterStores[0].address) {
          driveAddress = filterStores[0].address.address_line1 + ", " + filterStores[0].address.city + ", " + filterStores[0].address.region + " " + filterStores[0].address.postal_code;
          drive = filterStores[0].address.postal_code;
        }
        if (filterStores[0].location_names && filterStores[0].location_names.length) {
          onlineStore = filterStores[0].location_names[0].name;
        }
      }
    }
    return {driveAddress, drive, onlineStore};
  }, storeId)

  await context.goto('https://www.target.com' + productUrl,  { timeout: 30000, waitUntil: 'load', checkBlocked: true });

  await context.waitForXPath("//h1[@data-test='product-title']");

  await context.evaluate(async function (storeId, postalCode, locationData) {
    let parentData = {};
    let origData = {};

    function addHiddenDiv (el, className, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', className);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function createListItem () {
      const newDiv = document.createElement('li');
      newDiv.setAttribute('class', 'productInfo');
      newDiv.textContent = '';
      newDiv.style.display = 'none';
      document.getElementById('mainContainer').appendChild(newDiv);
      return newDiv;
    }

    function decodeHtml(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(500);
      scrollTop += 500;
      if (scrollTop === 5000) {
        break;
      }
    }

    window.scroll(0, 1000);

    await stall(2000);

    let id = '';
    if (window.location.href.includes('?preselect=')) {
      let splitUrl = window.location.href.split('?preselect=')[1];
      id = splitUrl.split('#')[0]
    } else {
      let splitUrl = window.location.href.split('-');
      id = splitUrl[splitUrl.length - 1];
    }

    async function getProductInfo (variant, productName, variantCount = null) {

      const newDiv = createListItem();

      addHiddenDiv(newDiv, 'driveAddress', locationData.driveAddress);
      addHiddenDiv(newDiv, 'drive', locationData.drive);
      addHiddenDiv(newDiv, 'onlineStore', locationData.onlineStore);

      addHiddenDiv(newDiv, 'productName', decodeHtml(productName));

      let secondaryImages = [];
      if (variant.enrichment && variant.enrichment.images && variant.enrichment.images.length) {
        addHiddenDiv(newDiv, 'primaryImage', variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary);
      }

      const productTitle = document.querySelector('h1[data-test="product-title"]').innerText;

      if (productTitle && variant.variation_info && variant.variation_info.themes) {
        addHiddenDiv(newDiv, 'nameExtended', decodeHtml(productTitle));
      } else {
        addHiddenDiv(newDiv, 'nameExtended', decodeHtml(productTitle));
      }

      const splitUrl = window.location.href.split('-');
      splitUrl[splitUrl.length - 1] = variant.tcin;
      addHiddenDiv(newDiv, 'productUrl', splitUrl.join('-'));

      if (variant.product_brand && variant.product_brand.brand) {
        addHiddenDiv(newDiv, 'brand', variant.product_brand.brand);
      }

      if (variant.upc) {
        addHiddenDiv(newDiv, 'upc', variant.upc.toString());
      }

      if (variant.tcin) {
        addHiddenDiv(newDiv, 'sku', variant.tcin);
      }

      if (variant.dpci) {
        addHiddenDiv(newDiv, 'variantId', variant.dpci);
      }

      if (variant.variation && variant.variation.size) {
        addHiddenDiv(newDiv, 'size', variant.variation.size);
      }

      document.querySelector('div[data-test="breadcrumb"]').querySelectorAll('span[itemprop="name"]').forEach((e, ind) => {
        if (ind > 0) {
          addHiddenDiv(newDiv, 'category', e.innerText);
        }
      });

      addHiddenDiv(newDiv, 'retailerId', storeId);

      const storeString = "&pricing_store_id=" + storeId + "&storeId=" + storeId + "&store_id=" + storeId;
      await fetch('https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=eb2551e4accc14f38cc42d32fbc2b2ea&tcin=' + variant.tcin + '&fulfillment_test_mode=grocery_opu_team_member_test' + storeString)
        .then(data => data.json())
        .then(availabilityData => {
          let inStore = false;
          let deliver = false;
          if (availabilityData &&
          availabilityData.data &&
          availabilityData.data.product &&
          availabilityData.data.product.fulfillment) {
            if (availabilityData.data.product.fulfillment.store_options &&
                availabilityData.data.product.fulfillment.store_options.length) {
                  availabilityData.data.product.fulfillment.store_options.forEach(store => {
                    if(store.in_store_only.availability_status === 'IN_STOCK' || store.in_store_only.availability_status.includes('LIMITED_STOCK')) {
                      inStore = true;
                    }
                  });
            }

            if (availabilityData.data.product.fulfillment.shipping_options &&
                (availabilityData.data.product.fulfillment.shipping_options.availability_status === 'IN_STOCK' || availabilityData.data.product.fulfillment.shipping_options.availability_status.includes('LIMITED_STOCK'))) {
              deliver = true;
            }
          }

          if (deliver) {
            addHiddenDiv(newDiv, 'availability', 'In Stock');
          } else if (inStore) {
            addHiddenDiv(newDiv, 'availability', 'In Store Only');
          }
          if (!deliver && !inStore) {
            addHiddenDiv(newDiv, 'availability', 'Out of stock');
          }
        });

      await fetch('https://redsky.target.com/web/pdp_location/v1/tcin/' + variant.tcin + '?key=eb2551e4accc14f38cc42d32fbc2b2ea' + storeString)
        .then(data => data.json())
        .then(variantData => {
          if (variantData.price) {
            if (variantData.price.current_retail) {
              addHiddenDiv(newDiv, 'price', variantData.price.current_retail);
            }
            if (variantData.price.reg_retail) {
              addHiddenDiv(newDiv, 'regPrice', variantData.price.reg_retail);
            }
            if (variantData.price.save_dollar) {
              promotionFlag = 'Yes';
              addHiddenDiv(newDiv, 'promotion', 'Save $' + variantData.price.save_dollar.toFixed(2) + ' ' + variantData.price.save_percent + '%' + ' off');
            }
          }
        });

    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);

    const storeString = "&pricing_store_id=" + storeId + "&storeId=" + storeId + "&store_id=" + storeId;
    const splitUrl = window.location.href.split('-');
    const fUrl = 'https://redsky.target.com/v3/pdp/tcin/';
    const urlVars = '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&fulfillment_test_mode=grocery_opu_team_member_test' + storeString;
    const fullUrl = fUrl + splitUrl[splitUrl.length - 1].split('#')[0] + urlVars;
    let parentId;
    await fetch(`${fullUrl}`)
      .then(data => data.json())
      .then(async function (res) {
        if(res && res.product) {
          parentData = res;
          origData = res;
          getProductInfo(res.product.item, res.product.item.product_description.title);
        }
      });

  }, storeId, postalCode, locationData);
  await stall(3000);
  await context.extract(productDetails, { transform });
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
