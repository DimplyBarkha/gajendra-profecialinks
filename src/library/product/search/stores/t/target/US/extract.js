
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
    document.getElementById('storeId-utilityNavBtn').click();
    await stall(1000);
  });
  await context.setInputValue('#zipOrCityState', '48374');
  await context.evaluate(async function () {
    document.querySelector('button[data-test="storeLocationSearch-button"]').click();
  });
  await context.waitForXPath("//button[@data-test='storeId-listItem-setStore']");
  await context.evaluate(function () {
    document.querySelectorAll('button[data-test="storeId-listItem-setStore"]')[0].click();
  });


  const clickNextBtn = () => {
    const nextBtn = document.querySelector('a[data-test="next"]');
    if (nextBtn != null && !nextBtn.hasAttribute('disabled')) {
      nextBtn.click();
    }
  };

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  let counter = 1;
  let results = [];
  while (true) {
    await stall(500);
    await context.waitForXPath('//ul//li');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 9000) {
        await stall(2500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 9000) {
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv (el, myClass, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', myClass);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        el.appendChild(newDiv);
      }
      await stall(1000);
      const itemContainers = document.querySelectorAll('li.Col-favj32-0.h-padding-a-none.h-display-flex');
      let rank = 1;
      let absRank = 1;
      for (const itemContainer of itemContainers) {
        if (itemContainer.querySelector('a[data-test="product-title"]')) {
          addHiddenDiv(itemContainer, 'productUrl', 'https://target.com' + itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href'));
          addHiddenDiv(itemContainer, 'product-name', itemContainer.querySelector('a[data-test="product-title"]').getAttribute('aria-label'));
          let itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('?')[0].split('/')[4];
          itemId = itemId.split('-')[1];
          addHiddenDiv(itemContainer, 'itemId', itemId);
          const picture = itemContainer.querySelector('picture');
          if (picture && picture.querySelector('source') && picture.querySelector('source').getAttribute('srcset')) {
            addHiddenDiv(itemContainer, 'thumbnail', picture.querySelector('source').getAttribute('srcset'));
          }
          if (itemContainer.querySelector('div[data-test="ratings"]')) {
            const rating = itemContainer.querySelector('div[data-test="ratings"]').innerText.split(' ')[0];
            addHiddenDiv(itemContainer, 'rating', rating);
          }
        }

        /*const searchTerm = window.location.href.split('?')[1].replace('searchTerm=', '');
        if(searchTerm.indexOf('&') > -1) {
          searchTerm = searchTerm.split('&')[0];
        }
        const url = "https://redsky.target.com/v2/plp/search/?channel=web&count=96&default_purchasability_filter=true&isDLP=false&keyword=" + searchTerm + "&offset=0&pageId=%2Fs%2F" + searchTerm + "&pricing_store_id=731&store_ids=731%2C1913%2C2048%2C1460%2C870&visitorId=016C5158F8BA020191266F57ACA6F132&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F75.0.3770.142+Safari%2F537.36&key=eb25512NHfDGHRWZL8a4t8yFNC15WHgjFatpZsh";
        addHiddenDiv(itemContainer, 'searchUrl', url);*/

        const endorsement = itemContainer.querySelector('.AtTargetMessage__AtTargetMessageWrapper-sc-1gv6org-0.liCFqa.h-text-grayDark');
        if (endorsement) {
          addHiddenDiv(itemContainer, 'endorsement', endorsement.innerText.trim());
        }

      }
    });

    await stall(250);
    const extract = await context.extract(productDetails, { transform });
    results = [...results, ...extract];
    await stall(250);
    const maxPage = await context.evaluate(function () {
      let maxPage = 0;
      document.querySelectorAll('.h-text-lg').forEach(e => {
        if (e.innerText.indexOf('page') === 0) {
          maxPage = e.innerText.split('of')[1].trim();
        }
      });
      return maxPage;
    });
    console.log('maxPage', maxPage);
    if (parseInt(maxPage) === counter) {
      break;
    }

    const hasNextBtn = await context.evaluate(function () {
      const nextBtn = document.querySelector('a[data-test="next"]');
      if (nextBtn != null && !nextBtn.hasAttribute('disabled')) {
        return true;
      }
      return false;
    });

    if (!hasNextBtn) {
      break;
    }

    await stall(250);
    await context.evaluate(clickNextBtn);
    if (counter === 4) {
      break;
    }
    counter++;
  }
  return [];
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
