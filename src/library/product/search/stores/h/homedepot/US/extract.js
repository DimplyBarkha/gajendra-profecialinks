
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  try {
    try {
      await context.waitForSelector('a.row-header__link');
      await context.waitForSelector('a.customNav__heading');
    } catch (e) {
      console.log('Listing page link not found');
    }
    await context.evaluate(async function () {
      if (document.querySelector('a.row-header__link')) {
        document.querySelector('a.row-header__link').click();
      } else {
        if (document.querySelector('a.customNav__heading')) {
          document.querySelector('a.customNav__heading').click();
        }
      }
    });
    await context.waitForNavigation();
  } catch (e) {
    console.log('Category page found. Could not navigate to listings page.');
  }
  async function addUrl () {
    function addHiddenDiv1 (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv1('added-searchurl', url);
  }
  await context.evaluate(addUrl);

  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (el, id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    // This is for Core Inputs
    if (getElementByXpath('//div[@class="product-details"]/div/span[@class="product-title"]/h1')) {
      if (!getElementByXpath("//div/div[starts-with(@class,'desktop product-pod')]")) {
        console.log('This is for Core Inputs');
        var prodEl = document.createElement('div');
        var prodE2 = document.createElement('div');
        prodE2.id = 'core_inputs';
        document.body.appendChild(prodE2);
        prodEl.setAttribute('class', 'desktop product-pod');

        document.querySelector('#core_inputs').appendChild(prodEl);

        const name = getElementByXpath('//div[@class="product-details"]/div/span[@class="product-title"]/h1');
        const productID = getElementByXpath('//*[@id="root"]/div/div/div/div/div/div/div/div/div[@class="product-info-bar"]/h2[1]/text()[2]');
        const productImage = getElementByXpath('//div[@class="mediagallery__mainimage"]/div/a/div/img/@src');
        const ratingCount = getElementByXpath('//*[@id="product-details__review__target"]/span');
        const productURL = getElementByXpath('//*[@rel="canonical"]/@href');
        const aggregateRating = document.querySelector('.stars');
        const actualPrice = getElementByXpath('//*[@id="standard-price"]/div[@class="price"]/div[@class="price-format__large price-format__main-price"]');
        // this is for price
        // var actualPrice = ""
        // var priceJson = JSON.parse(document.querySelector('html > head > script[type="application/ld+json"]').innerText);
        // if(priceJson.offers != null && priceJson.offers != undefined){
        //   actualPrice = priceJson.offers.price;
        // }
        // This is for aggregateRating.
        let singleRating = aggregateRating.style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1);
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);

        if (name) {
          document.querySelector('div.desktop.product-pod').setAttribute('name', name.textContent);
        }
        if (productID) {
          document.querySelector('div.desktop.product-pod').setAttribute('productID', productID.textContent);
        }
        if (productImage) {
          document.querySelector('div.desktop.product-pod').setAttribute('productImage', productImage.textContent);
        }
        if (aggregateRating) {
          document.querySelector('div.desktop.product-pod').setAttribute('aggregateRating', singleRating);
        }
        if (ratingCount) {
          document.querySelector('div.desktop.product-pod').setAttribute('ratingCount', ratingCount.textContent);
        }
        if (actualPrice) {
          document.querySelector('div.desktop.product-pod').setAttribute('price', actualPrice.textContent);
        }
        if (productURL) {
          document.querySelector('div.desktop.product-pod').setAttribute('productURL', productURL.textContent);
        }
      }
    }
    // This is for Name
    const twoName = document.querySelectorAll('div.product-pod__title > a > div > h2');
    var name = '';

    if (twoName != null && twoName != undefined) {
    // console.log("Working fine",twoName[1].childElementCount)
      for (let k = 0; k < twoName.length; k++) {
        if (twoName[k].childElementCount > 1) {
          name = twoName[k].firstChild.textContent + ' ' + twoName[k].lastChild.textContent;
        } else {
          name = twoName[k].textContent;
        }
        addHiddenDiv(twoName[k], 'name', name);
      }
    }

    // This is for Rank

    // const itemContainers = document.querySelectorAll('div.desktop.product-pod');
    // let rank = 1;
    // // @ts-ignore
    // for (const itemContainer of itemContainers) {
    //   console.log(itemContainer);
    //   const totalRank = itemContainer + rank;
    //   addHiddenDiv(itemContainer, 'rank', totalRank);
    //   rank++;
    // }
    // This is for aggregate Rating.
    const aggregateRating = document.querySelectorAll('.stars');
    for (let k = 0; k < aggregateRating.length; k++) {
      console.log('This is Rating');
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      //   addHiddenDiv('aggregateRating', singleRating, k);
      console.log('This is Rating Result : ', singleRating);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform,
    domain: 'homedepot.com',
    zipcode: '',
  },
  implementation,
};

// **************************************
// module.exports = {
//   implements: 'product/search/extract',
//   parameterValues: {
//     country: 'US',
//     store: 'homedepot',
//     transform: null,
//     domain: 'homedepot.com',
//     zipcode: '',
//   },
// };
