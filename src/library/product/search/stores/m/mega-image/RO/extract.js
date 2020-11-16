const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RO',
    store: 'mega-image',
    transform,
    domain: 'mega-image.ro',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
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
      const fetchProducts = async function (context) {
        const refURL = window.location.href;
        const page = refURL.match(/(\d+)$/)[0];
        const searchQuery = refURL.match(/q=(.*):/)[1];
        console.log('eloo', searchQuery);
        console.log('eloo', page);
        const response = await fetch('https://api.mega-image.ro/', {
          headers: {
            accept: '*/*',
            'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
          },
          referrer: 'https://www.mega-image.ro/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `{"operationName":"GetProductSearch","variables":{"lang":"ro","searchQuery":"${searchQuery}:relevance","sort":"relevance","pageNumber":${page},"pageSize":20,"filterFlag":true},"query":"query GetProductSearch($anonymousCartCookie: String, $lang: String, $searchQuery: String, $pageSize: Int, $pageNumber: Int, $category: String, $sort: String, $filterFlag: Boolean) {\\n  productSearch(anonymousCartCookie: $anonymousCartCookie, lang: $lang, searchQuery: $searchQuery, pageSize: $pageSize, pageNumber: $pageNumber, category: $category, sort: $sort, filterFlag: $filterFlag) {\\n    products {\\n      ...ProductDetails\\n      __typename\\n    }\\n    breadcrumbs {\\n      facetCode\\n      facetName\\n      facetValueName\\n      facetValueCode\\n      removeQuery {\\n        query {\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    facets {\\n      code\\n      name\\n      category\\n      facetUiType\\n      values {\\n        code\\n        count\\n        name\\n        query {\\n          query {\\n            value\\n            __typename\\n          }\\n          __typename\\n        }\\n        selected\\n        __typename\\n      }\\n      __typename\\n    }\\n    sorts {\\n      name\\n      selected\\n      code\\n      __typename\\n    }\\n    pagination {\\n      currentPage\\n      totalResults\\n      totalPages\\n      sort\\n      __typename\\n    }\\n    freeTextSearch\\n    currentQuery {\\n      query {\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment ProductDetails on Product {\\n  available\\n  averageRating\\n  manufacturerName\\n  code\\n  freshnessDuration\\n  freshnessDurationTipFormatted\\n  frozen\\n  recyclable\\n  images {\\n    format\\n    imageType\\n    url\\n    __typename\\n  }\\n  maxOrderQuantity\\n  limitedAssortment\\n  name\\n  onlineExclusive\\n  potentialPromotions {\\n    code\\n    priceToBurn\\n    promotionType\\n    range\\n    redemptionLevel\\n    toDisplay\\n    description\\n    title\\n    promoBooster\\n    simplePromotionMessage\\n    __typename\\n  }\\n  price {\\n    approximatePriceSymbol\\n    currencySymbol\\n    formattedValue\\n    priceType\\n    supplementaryPriceLabel1\\n    supplementaryPriceLabel2\\n    showStrikethroughPrice\\n    discountedPriceFormatted\\n    unit\\n    unitCode\\n    unitPrice\\n    value\\n    __typename\\n  }\\n  purchasable\\n  productProposedPackaging\\n  productProposedPackaging2\\n  stock {\\n    inStock\\n    inStockBeforeMaxAdvanceOrderingDate\\n    partiallyInStock\\n    availableFromDate\\n    __typename\\n  }\\n  url\\n  previouslyBought\\n  __typename\\n}\\n"}`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });

        if (response && response.status === 400) {
          throw new Error('Error when calling API');
        }
        if (response && response.status === 404) {
          console.log('Product Not Found!!!!');
        }
        if (response && response.status === 200) {
          console.log('Product Found!!!!');
          const prodcutsData = await response.json();
          /* addAllHiddenDiv(prodcutsData.data.productSearch.products); */
          console.log('object :>> ', prodcutsData.data.productSearch.products);
          
          return prodcutsData;
        }
      };
      fetchProducts();
      await stall(20000);
    });
    return await context.extract(productDetails, { transform });
  },
};
