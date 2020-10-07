const {
  transform
} = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    "country": "UK",
    "store": "sportsdirect",
    transform,
    "domain": "sportsdirect.com",
    "zipcode": "",
  },

  implementation: async ({
    inputString
  }, {
    country,
    store,
    transform
  }, context, dependencies) => {


    // await context.evaluate(async function () {
    //   async function getApiData(url) {
    //     let ratingResponse = [];
    //     console.log("Url is");
    //     console.log(url)
    //     const response = await fetch(url, {
    //       headers: {
    //         accept: '*/*',
    //         'accept-language': 'en-US,en;q=0.9',
    //         'sec-fetch-dest': 'script',
    //         'sec-fetch-mode': 'no-cors',
    //         'sec-fetch-site': 'cross-site',
    //       },
    //       body: null,
    //       method: 'GET',
    //       mode: 'cors',
    //     });

    //     if (response && response.status === 400) {
    //       throw new Error('Error when calling API');
    //     }

    //     if (response && response.status === 404) {
    //       console.log('Product Not Found!!!!');
    //     }

    //     if (response && response.status === 200) {
    //       console.log('Ratings Found!!!!');
    //       const data = await response.json();
    //       console.log('da is')
    //       console.log(data)
    //       ratingResponse.push(data.Results);
    //       console.log(ratingResponse)
    //     }
    //   }


    //   async function composeRatingUrlPerPage() {
    //     let url='';

    //     let productsLi = document.querySelectorAll('ul.s-productscontainer2>li');
    //     let prodIdString = ''
    //     if (productsLi.length > 0) {
    //       for (var i = 0; i < productsLi.length; i++) {
    //         let lowerLimit = productsLi[i].getAttribute('li-productid');
    //         let upperLimit = productsLi[i].getAttribute('li-seq');
    //         lowerLimit = lowerLimit.substring(0, 6)
    //         prodIdString += `${lowerLimit}-${upperLimit},`
    //       }

    //     }
    //     prodIdString = prodIdString.substring(0, prodIdString.lastIndexOf(','));
    //     // console.log(prodIdString)
    //     url = `https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caiGlgNZJbkmq4vv9Aasd5JdLBg2YKJzgwEEhL0sLkQUw&stats=Reviews&filter=ContentLocale:en_GB,en*&filter=ProductId:${prodIdString}`
    //     return url
        
    //   }

    //   const url = await composeRatingUrlPerPage();
    //   console.log(url)
    //   await getApiData(url)

    // })

    return await context.extract(dependencies.productDetails, {
      transform
    });
  },
}