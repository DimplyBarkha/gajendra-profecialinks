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
  async function getAllDeals () {
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
    const clientID = 'goldbox';
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
    const body = {
      requestMetadata: {
        marketplaceID,
        clientID,
        sessionID,
      },
      responseSize: 'ALL',
      itemResponseSize: 'NONE',
      queryProfile: {
        dealTypes: [
          'LOCAL_DEAL',
          'LIGHTNING_DEAL',
          'COMPOSITE_DEAL',
          'COUPON_DEAL',
          'BEST_DEAL',
          'EVENT_DEAL',
          'POPULAR_DEAL',
          'FEATURED_PARTNER_DEAL',
          'DEAL_OF_THE_DAY',
          'PERSONALIZED_DEAL',
          'FEATURED_CATEGORY_DEAL',
        ],
      },
    };
    const API = `${window.location.origin}/xa/dealcontent/v2/GetDealMetadata?nocache=${new Date().getTime()}`;
    const response = await fetch(API, {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include',
    });
    const data = await response.json();
    data.sortedDealIDs.forEach((dealId) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'api-deal-id');
      li.innerText = dealId;
      document.body.append(li);
    });
    return data.sortedDealIDs;
  }
  await context.evaluate(getAllDeals);
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
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
