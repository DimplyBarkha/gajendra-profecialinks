const { transform } = require('../shared');
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
  const { productDetails } = dependencies;

  async function main() {    
     // Deal page url. https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb 
    async function getDeatIdsFromPage(url = window.location.href) { 
        const response = await fetch(url);
        const html = await response.text();
        return JSON.parse(html.match(/sortedDealIDs"\s*:\s*(\[[^\]]+\])/)[1]);
    }
    const marketplaceIds = {
        ca: "A2EUQ1WTGCTBG2",
        "co.jp": "A1VC38T7YXB528",
        com: "ATVPDKIKX0DER",
        "co.uk": "A1F83G8C2ARO7P",
        de: "A1PA6795UKMFR9",
        es: "A1RKKUPIHCS9HS",
        fr: "A13V1IB3VIYZZH",
        it: "APJ6JRA9NG5V4",
        mx: "A1AM78C64UM0Y8",
    };
    // Returns all dealIds.
    async function getAllDeals() {
        const clientID = "goldbox";
        const sessionID = document.cookie.match(/session-id=([^;]+)/)[1];
        const tld = document
            .querySelector('[class="nav-logo-link"]')
            .getAttribute("aria-label")
            .match(/\.(.+)$/) ?
            document
            .querySelector('[class="nav-logo-link"]')
            .getAttribute("aria-label")
            .match(/\.(.+)$/)[1] :
            "com";
        const body = {
            "requestMetadata": {
                "marketplaceID": marketplaceIds[tld.toLowerCase()],
                clientID,
                sessionID
            },
            "responseSize": "ALL",
            "itemResponseSize": "NONE",
            "queryProfile": {
                "dealTypes": [
                    "LOCAL_DEAL",
                    "LIGHTNING_DEAL",
                    "COMPOSITE_DEAL",
                    "COUPON_DEAL",
                    "BEST_DEAL",
                    "EVENT_DEAL",
                    "POPULAR_DEAL",
                    "FEATURED_PARTNER_DEAL",
                    "DEAL_OF_THE_DAY",
                    "PERSONALIZED_DEAL",
                    "FEATURED_CATEGORY_DEAL"
                ]
            }
        }
        const API = `${window.location.origin}/xa/dealcontent/v2/GetDealMetadata?nocache=${new Date().getTime()}`;
        const response = await fetch(API, {
            method: "POST",
            body: JSON.stringify(body),
            mode: "cors",
            credentials: "include",
        });
        const data = await response.json();
        return data.sortedDealIDs;
    }
    // Function to divide ids into chunks of array. Needed for API since 100 is the limit.
    function chunk(arr, chunkSize) {
        const arrChunk = [];
        for (let i = 0, len = arr.length; i < len; i += chunkSize)
        arrChunk.push(arr.slice(i, i + chunkSize));
        return arrChunk;
    }
    const dealIds = await getDeatIdsFromPage(window.location.href); 
    async function getDealDetails(dealIds) {
        const chunkedDealIds = chunk(dealIds, 100);
        const clientID = "goldbox_mobile_pc";
        const sessionID = document.cookie.match(/session-id=([^;]+)/)[1];
        const tld = document
            .querySelector('[class="nav-logo-link"]')
            .getAttribute("aria-label")
            .match(/\.(.+)$/) ?
            document
            .querySelector('[class="nav-logo-link"]')
            .getAttribute("aria-label")
            .match(/\.(.+)$/)[1] :
            "com";
        const API = `${window.location.origin}/xa/dealcontent/v2/GetDeals?nocache=${new Date().getTime()}`;
        const combinedData = [];
        for (const dealIdChunk of chunkedDealIds) {
            const parsedDealId = dealIdChunk.map(id => ({
                dealID: id
            }));
            const body = {
                requestMetadata: {
                    marketplaceID: marketplaceIds[tld.toLowerCase()],
                    clientID,
                    sessionID,
                },
                // Sample JSON shows only one dealID. Could be that we might have to call one API per dealID.
                dealTargets: parsedDealId,
                responseSize: "ALL",
                itemResponseSize: "DEFAULT_WITH_PREEMPTIVE_LEAKING",
            };
            const response = await fetch(API, {
                method: "POST",
                body: JSON.stringify(body),
                mode: "cors",
                credentials: "include",
            });
            const data = await response.json();
            combinedData.push(data);
        }
        return combinedData;
    }
    const data = await getDealDetails(dealIds);
    return data;
  }
  console.log(await context.evaluate(main));
  return await context.extract(productDetails, { transform });
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
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
