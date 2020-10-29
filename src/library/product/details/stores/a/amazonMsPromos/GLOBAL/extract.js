/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails, goto } = dependencies;
  const { id } = inputs;
  async function getDealInfo (dealID) {
    const marketplaceIds = {
      ca: 'A2EUQ1WTGCTBG2',
      'co.jp': 'A1VC38T7YXB528',
      com: 'ATVPDKIKX0DER',
      'co.uk': 'A1F83G8C2ARO7P',
      de: 'A1PA6795UKMFR9',
      es: 'A1RKKUPIHCS9HS',
      fr: 'A13V1IB3VIYZZH',
      it: 'APJ6JRA9NG5V4',
      mx: 'A1AM78C64UM0Y8',
    };

    async function checkAndAddItems (data, dealID) {
      if (data && data.dealDetails && data.dealDetails[dealID] && data.dealDetails[dealID].items && data.dealDetails[dealID].items.length === 0) {
        if (data.dealDetails[dealID].type === 'COUPON_DEAL') {
          const encryptedPromoId = data.dealDetails[dealID].egressUrl.match(/[A-Z0-9]+$/) && data.dealDetails[dealID].egressUrl.match(/[^/]+$/)[0];
          if (!encryptedPromoId) {
            return encryptedPromoId;
          }
          try {
            const requestedAsins = 100;
            let previouslySeen = 0;
            let hasResults = true;
            while (hasResults) {
              const API = `${window.location.origin}/gp/coupon/ajax/get_clp_asins.html?encryptedPromoId=${encryptedPromoId}&requestedAsins=${requestedAsins}&previouslySeen=${previouslySeen}`;
              const response = await fetch(API);
              const jsonData = await response.json();
              const itemsHtml = jsonData.items;
              if (itemsHtml.length) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(itemsHtml, 'text/html');
                const items = Array.from(doc.querySelectorAll('td[class="product-list-table-col"] > a.a-link-normal'))
                  .map((elm) => elm.getAttribute('href'))
                  .filter((elm) => elm.match(/redirectASIN=([^&]+)/))
                  .map((elm) => ({
                    itemID: elm.match(/redirectASIN=([^&]+)/)[1],
                  }));
                if (items.length) {
                  data.dealDetails[dealID].items = data.dealDetails[dealID].items.concat(items);
                  previouslySeen += requestedAsins;
                } else {
                  hasResults = false;
                }
              }
            }
          } catch (err) {
            throw new Error(`API failed. Promo may not exist. Error: ${err}`);
          }
        }
      }

      if (data && data.dealDetails && data.dealDetails[dealID] && data.dealDetails[dealID].items && data.dealDetails[dealID].items.length) {
        data.dealDetails[dealID].asins = data.dealDetails[dealID].items.map(elm => elm.itemID);
      }
      return data;
    }

    async function getDealDetails (dealID) {
      const clientID = 'goldbox_mobile_pc';
      const sessionID = ue_sid || document.cookie.match(/session-id=([^;]+)/)[1];
      const tld = document
        .querySelector('.nav-logo-link')
        .getAttribute('aria-label')
        .match(/\.(.+)$/)
        ? document
          .querySelector('.nav-logo-link')
          .getAttribute('aria-label')
          .match(/\.(.+)$/)[1]
        : 'com';

      const marketplaceID = ue_mid || marketplaceIds[tld.toLowerCase()];
      const API = `${window.location.origin}/xa/dealcontent/v2/GetDeals?nocache=${new Date().getTime()}`;
      const body = {
        requestMetadata: {
          marketplaceID,
          clientID,
          sessionID,
        },
        dealTargets: [{
          dealID,
        }],
        responseSize: 'ALL',
      };
      const response = await fetch(API, {
        method: 'POST',
        body: JSON.stringify(body),
        mode: 'cors',
        credentials: 'include',
      });
      const data = await response.json();
      const updatedData = await checkAndAddItems(data, dealID);
      return updatedData;
    }
    return await getDealDetails(dealID);
  }
  const data = await context.evaluate(getDealInfo, id);

  if (data && data.dealDetails && data.dealDetails[id] && data.dealDetails[id].egressUrl) {
    data.dealDetails[id].egressUrl = data.dealDetails[id].egressUrl.replace(/YOUR_DEAL_ID/g, id);
    await goto({ url: data.dealDetails[id].egressUrl });
  }
  await context.evaluate((data) => { document.body.setAttribute('promo-data', JSON.stringify(data)); }, data);
  return await context.extract(productDetails);
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    goto: 'action:navigation/goto',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
