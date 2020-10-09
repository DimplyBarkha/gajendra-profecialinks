const {
  transform,
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
    inputString,
  }, {
    country,
    store,
    transform,
  }, context, dependencies) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }

        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);

    await context.evaluate(async function () {
      let ratingResponse = [];
      let productsLi = [];
      async function getApiData(url) {
        // console.log('Url is');
        // console.log(url);
        const response = await fetch(url, {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'script',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
          },
          body: null,
          method: 'GET',
          mode: 'cors',
        });

        if (response && response.status === 400) {
          throw new Error('Error when calling API');
        }

        if (response && response.status === 404) {
          // console.log('Product Not Found!!!!');
        }

        if (response && response.status === 200) {
          // console.log('Ratings Found!!!!');
          const data = await response.json();
          ratingResponse = data.Results;
          // ratingResponse.push(data.Results);
          // console.log(ratingResponse[0]);
        }
      }

      async function composeRatingUrlPerPage() {
        let url = '';

        productsLi = document.querySelectorAll('ul.s-productscontainer2>li');
        let prodIdString = '';
        if (productsLi.length > 0) {
          for (var i = 0; i < productsLi.length; i++) {
            let lowerLimit = productsLi[i].getAttribute('li-productid');
            const upperLimit = productsLi[i].getAttribute('li-seq');
            lowerLimit = lowerLimit.substring(0, 6);
            prodIdString += `${lowerLimit}-${upperLimit},`;
          }
          // console.log("exiting loop");
        }
        prodIdString = prodIdString.substring(0, prodIdString.lastIndexOf(','));
        // console.log(prodIdString)
        url = `https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caiGlgNZJbkmq4vv9Aasd5JdLBg2YKJzgwEEhL0sLkQUw&stats=Reviews&filter=ContentLocale:en_GB,en*&filter=ProductId:${prodIdString}`;
        return url;
      }

      const url = await composeRatingUrlPerPage();
      await getApiData(url);

      async function addRatingToEle() {
        if (ratingResponse.length > 0) {
          if (productsLi.length > 0) {
            for (var i = 0; i < productsLi.length; i++) {
              let lowerLimit = productsLi[i].getAttribute('li-productid');
              const upperLimit = productsLi[i].getAttribute('li-seq');
              lowerLimit = lowerLimit.substring(0, 6);
              const prodIdString = `${lowerLimit}-${upperLimit}`;

              // console.log("prodIdString");
              // console.log(prodIdString);
              // console.log("rating responsee");
              // console.log(ratingResponse);
              let rating = null;
              rating = ratingResponse.find(function (item) {
                return item.ProductStatistics.ProductId === prodIdString;
              });
              // const value = rating.ProductStatistics.ReviewStatistics;
              if (rating !== null) {
                addEleToDoc(productsLi[i], 'ratingDiv', rating);
              }
            };
          }
        }
      }

      function addEleToDoc(liEle, key, ratingValue) {
        console.log(ratingValue);

        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = ratingValue;
        prodEle.style.display = 'none';
        liEle.appendChild(prodEle);

        let att = document.createAttribute("ratingValue");
        att.value = ratingValue.ProductStatistics.ReviewStatistics.AverageOverallRating === null ? '' : parseFloat(ratingValue.ProductStatistics.ReviewStatistics.AverageOverallRating).toFixed(1);
        prodEle.setAttributeNode(att);

        att = document.createAttribute("reviewCount");
        att.value = ratingValue.ProductStatistics.ReviewStatistics.TotalReviewCount;
        prodEle.setAttributeNode(att);
      }

      await addRatingToEle();
    });

    return await context.extract(dependencies.productDetails, {
      transform,
    });
  },
};