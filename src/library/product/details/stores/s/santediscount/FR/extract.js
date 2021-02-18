const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    transform,
    domain: 'santediscount.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    if (inputs.id) {
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      await context.evaluate(async function () {
        const isSearchPage = document.querySelector('body[class*="catalogsearch"]') ? document.querySelector('body[class*="catalogsearch"]') : null;
        const noResultsSelector = document.querySelector('div.catalogsearch_no_result--content');
        if (noResultsSelector) {
          throw new Error('No results for this RPC');
        }
        const isSelector = isSearchPage ? document.querySelector('h3.mini-product-name a') : null;
        if (isSelector) {
          try {
            isSelector.click();
            optionalWait('section.product-view-essential');
          } catch (err) {
            console.log('Not clicked' + err);
          }
        }
      });
    }

    await context.evaluate(async function (inputs) {
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      const response = await fetch(`https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=ca4sDXq7iXS9YMdnATzw4Opq9kFefC7YimHDEI3WkMLgE&productid=${inputs.id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=fr_FR`);
      console.log(`https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=ca4sDXq7iXS9YMdnATzw4Opq9kFefC7YimHDEI3WkMLgE&productid=${inputs.id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=fr_FR`);
      if (response.status !== 404) {
        var json = await response.json();
        console.log(`Resultant --> ${JSON.stringify(json)}`);

        if (document.querySelector('section.product-view-essential')) {
          document.querySelector('section.product-view-essential').setAttribute('review-total', json.reviewSummary.numReviews);
          document.querySelector('section.product-view-essential').setAttribute('review-average', json.reviewSummary.primaryRating.average);
        }
      } else {
        console.log('404');
      }
      optionalWait('section.product-view-essential');

      // const descrpitionEls = document.querySelectorAll('.std > *');
      // let directionString = '';
      // for (const [index, item] of descrpitionEls.entries()) {
      //   if (item.tagName === 'H2' && item.innerText.includes(`Conseils d'utilisation`)) {
      //     for (let i = index + 1; i < descrpitionEls.length; i++) {
      //       if (descrpitionEls[i].tagName !== 'H2') {
      //         directionString = `${directionString}\n${descrpitionEls[i].innerText}`;
      //       } else {
      //         directionString = directionString.trim();
      //         break;
      //       }
      //     }
      //   }
      // }
      const desc = document.querySelector('.std');
      let directionsHTML = '';
      let ingridientsHTML = '';

      if (desc) {
        let descHTML = desc.innerHTML;
        descHTML = descHTML.split(`\n</h2>`).join('</h2>');
        descHTML = descHTML.split(`<h2>\n`).join('<h2>');
        descHTML = descHTML.split(`<h2> `).join('<h2>');
        descHTML = descHTML.split(`&nbsp;</h2>`).join('</h2>');
        descHTML = descHTML.split(`<h2 dir="ltr">`).join('<h2>');
        descHTML = descHTML.split(`<h2 class="title-block">`).join('<h2>');
        descHTML = descHTML.split(`<h2 style="color: rgb(68, 68, 68); letter-spacing: 0.36396px;">`).join('<h2>');
        descHTML = descHTML.split(`<h2 style="text-align: justify;">`).join('<h2>');
        descHTML = descHTML.split(`<h2>Conseils d'utilisation :`);
        
        if (descHTML.length > 1) {
          directionsHTML = descHTML[1].split('<h2');
          directionsHTML = directionsHTML[0];
        }
      }

      if (desc && !directionsHTML) {
        let descHTML = desc.innerHTML;
        descHTML = descHTML.replace(`<strong> Conseils d'utilisation :`, `<strong>Conseils d'utilisation :`)
        descHTML = descHTML.replace(`<strong style="letter-spacing: 0.03em; font-size: 12.132px;">Conseils d'utilisation :`, `<strong>Conseils d'utilisation :`)
        descHTML = descHTML.replace(`<span style="color: inherit; font-size: 27.297px; font-weight: bold; letter-spacing: 0.03em;">Conseils d'utilisation :`, `<strong>Conseils d'utilisation :`)
        descHTML = descHTML.split(`<strong>Conseils d'utilisation :`);

        if (descHTML.length > 1) {
          directionsHTML = descHTML[1].split('<strong')[0];
          directionsHTML = directionsHTML.split('<h2')[0];
        }
      }
      
      const newDirectionEl = document.createElement('import-direction');
      newDirectionEl.innerHTML = directionsHTML;
      document.body.appendChild(newDirectionEl);

      if (desc) {
        let descHTML = desc.innerHTML;
        descHTML = descHTML.split(`\n</h2>`).join('</h2>');
        descHTML = descHTML.split(`&nbsp;</h2>`).join('</h2>');
        descHTML = descHTML.split(`<h2 dir="ltr">`).join('<h2>');
        descHTML = descHTML.split(`<h2 style="">`).join('<h2>');
        descHTML = descHTML.split(`<h2 style="text-align: justify;">`).join('<h2>');
        descHTML = descHTML.split(`<h2 style="color: rgb(68, 68, 68); letter-spacing: 0.36396px;">`).join('<h2>');
        descHTML = descHTML.split(`<span>Composition :`).join('<h2>Composition :');
        descHTML = descHTML.replace(`<span style="color: inherit; font-size: 27.297px; font-weight: bold; letter-spacing: 0.03em;">Composition :</span>`, `<h2>Composition :`)
        descHTML = descHTML.split(`<h2>Composition :`);
        
        if (descHTML.length > 1) {
          ingridientsHTML = descHTML[1].split('<h2');
          ingridientsHTML = ingridientsHTML[0];
        }
      }

      if (desc && !ingridientsHTML) {
        let descHTML = desc.innerHTML;
        descHTML = descHTML.split(`<strong>Composition :`);

        if (descHTML.length > 1) {
          ingridientsHTML = descHTML[1].split('<strong');
          ingridientsHTML = ingridientsHTML[0].split('<h2')[0];
        }
      }

      const newIngredientsEl = document.createElement('import-ingredients');
      newIngredientsEl.innerHTML = ingridientsHTML;
      document.body.appendChild(newIngredientsEl);

    }, inputs);
    await context.extract(productDetails, { transform });
  },
};
