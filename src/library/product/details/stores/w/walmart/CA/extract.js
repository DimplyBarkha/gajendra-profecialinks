const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function getPDP () {
    function getAPIBody () {
      const json = JSON.parse(document.querySelector('#tb-djs-wml-data').innerText);
      const body = json.ccm.common.features.defaultLPStore;
      return JSON.parse(body);
    }
    const json = getAPIBody();
    const bodies = [{
      sessionId: document.cookie.match(/walmart.id=([^;]+)/)[1],
      platform: 'desktop',
      placement: 'item_page.rr1|item_page.rr2|item_page.rr3',
      fsa: json.postalCode,
      availabilityStoreId: json.localStoreId || json.selectedStoreId || json.fulfillmentStoreId || '1061',
      lang: 'en',
      pricingStoreId: json.localStoreId || json.selectedStoreId || json.fulfillmentStoreId || '1061',
      fulfillmentStoreId: json.fulfillmentStoreId || '1061',
      experience: __PRELOADED_STATE__.common.experience,
      categoryId: __PRELOADED_STATE__.product.item.primaryCategories[0].id,
      productId: __PRELOADED_STATE__.product.activeSkuId,
    }, {
      sessionId: document.cookie.match(/walmart.id=([^;]+)/)[1],
      platform: 'desktop',
      placement: 'item_page.oos',
      fsa: json.postalCode,
      availabilityStoreId: json.localStoreId || json.selectedStoreId || json.fulfillmentStoreId || '1061',
      lang: 'en',
      pricingStoreId: json.localStoreId || json.selectedStoreId || json.fulfillmentStoreId || '1061',
      fulfillmentStoreId: json.fulfillmentStoreId || '1061',
      experience: __PRELOADED_STATE__.common.experience,
      categoryId: __PRELOADED_STATE__.product.item.primaryCategories[0].id,
      productId: __PRELOADED_STATE__.product.activeSkuId,
    }];

    async function getProducts (body) {
      const response = await fetch('https://www.walmart.ca/api/product-page/carousel/rr', {
        headers: {
          accept: 'application/json',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
          'content-type': 'application/json',
          'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        referrer: 'https://www.walmart.ca/en/ip/6000199816953',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
      const json = await response.json();
      const pdp = Object.values(json).map(elm => elm.products.map(p => p.name)).flat();
      return pdp;
    }

    let pdp = [];
    for (const body of bodies) {
      const data = await getProducts(body);
      pdp = pdp.concat(data);
    }
    pdp = Array.from(new Set(pdp));
    document.body.setAttribute('pdp', pdp.join('|'));
    return Array.from(new Set(pdp));
  }
  try {
    await context.evaluate(getPDP);
  } catch (error) {
    console.log('Error adding PDP', error);
  }
  await context.evaluate(() => {
    const sku = window.location.pathname.match(/[^\/]+$/)[0];
    document.body.setAttribute('sku', sku);
  });
  await context.evaluate(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
  });
  async function scrollToRec (node) {
    await context.evaluate(async (node) => {
      const element = document.querySelector(node) || null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('footer, footer#skip-to-footer');
  await scrollToRec('section#from-manufacturer-section');
  async function addWITB () {
    const element = Array.from(document.querySelector('.syndigo-shadowed-powerpage').shadowRoot.querySelectorAll('.syndigo-widget-section-header')).find(elm => elm.innerText.toLowerCase().match(/in the box/i));
    const witb = Array.from(element.nextElementSibling.querySelectorAll('.syndigo-featureset-feature')).map(elm => {
      const img = elm.querySelector('img').getAttribute('srcset').match(/^[^\s]+/) ? elm.querySelector('img').getAttribute('srcset').match(/^[^\s]+/)[0] : elm.querySelector('img').getAttribute('src');
      const text = elm.querySelector('img').getAttribute('alt');

      return { img, text };
    });
    const witbText = witb.map(elm => elm.text).join('|');
    const witbUrl = witb.map(elm => elm.img).join('|');
    document.body.setAttribute('witbText', witbText);
    document.body.setAttribute('witbUrl', witbUrl);
  }
  async function addCTR () {
    if (document.querySelector('.syndigo-shadowed-powerpage').shadowRoot.querySelector('[class="wc-comparison-table-responsive"]')) {
      document.body.setAttribute('ctr', 'Yes');
    }
  }
  try {
    await context.evaluate(addWITB);
  } catch (error) {
    console.log('Error adding WITB', error);
  }
  try {
    await context.evaluate(addCTR);
  } catch (error) {
    console.log('Error adding CTR', error);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
