const { transform } = require('../format');
async function implementation (inputs, parameters, context, dependencies) {
  const { page } = inputs;
  // NOTE: Ugly hack to avoid nightmare timeout error in case of more reviews, limiting pages to 35
  console.log(page, 'page');
  if (page > 5) {
    return false;
  }
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const isStorePresent = await context.evaluate(async function () {
    const isStorePresent = document.querySelector('#store-search-handler');
    // @ts-ignore
    return isStorePresent ? !!isStorePresent.innerText.trim().includes('Burbank Lowe') : false;
  });
  try {
    console.log('Is store present-->', isStorePresent);
    if (!isStorePresent) {
      await context.waitForSelector('span#store-search-handler');
      await context.evaluate(async function () {
        const storeButton = document.querySelector('span#store-search-handler');
        const storeButtonTwo = document.querySelector('span.styles__StoreNameWrapper-RC__sc-vrpk8j-0 span');
        if (storeButton) {
          // @ts-ignore
          storeButton.click();
        } else {
          if (storeButtonTwo) {
            storeButtonTwo.click();
          }
        }
      });
      await context.evaluate(async function () {
        const inputElement = document.querySelector('input[class*="type--text incomplete"]');
        inputElement && inputElement.setAttribute('value', 'Burbank Lowe');
      });
      await context.waitForSelector('input[value*="Burbank Lowe"]');
      await context.evaluate(async function () {
        const formButton = document.querySelector('form button[class*="variant--primary"]');
        // @ts-ignore
        formButton && formButton.click();
      });

      await context.waitForSelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
      await context.evaluate(async function () {
        const selectButton = document.querySelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
        // @ts-ignore
        selectButton && selectButton.click();
      });
      await context.waitForNavigation();
    }
  } catch (error) {
    console.log('Faild to set store location', error);
  }

  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 10000) {
  //       await stall(500);
  //       scrollTop += 1000;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 10000) {
  //         await stall(1000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await applyScroll(context);
  async function autoScroll (page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  await autoScroll(context);
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const row = document.querySelectorAll(
      'div[class="items"] div[class="tile_group"]',
    );
    if (row) {
      for (let index = 0; index < row.length; index++) {
        const element = row[index];
        const array = element.children;
        for (let ind = 0; ind < array.length; ind++) {
          const innerElement = array[ind];
          const attValue = innerElement.getAttribute('data-tile');
          if (!document.getElementById(`pd_row${attValue}`)) {
            addHiddenDiv(`pd_row${attValue}`, '');
          }
        }
      }
    }
    const rowOne = document.querySelectorAll(
      'div[class="items"] div[class="tile_group"] > *',
    );
    if (rowOne) {
      for (let ind = 0; ind < rowOne.length; ind++) {
        const innerElement = rowOne[ind];
        const attValue = innerElement.getAttribute('data-tile');
        // @ts-ignore
        innerElement.style.display = 'none';
        document.getElementById(`pd_row${attValue}`).appendChild(innerElement);
      }
    }
    // const myObj = document.querySelectorAll('div[id*="pd_row"]');
    // if(myObj && myObj.length) {
    //   myObj.forEach(obj=>obj.remove())
    // }
  });

  await context.evaluate(async function () {
    const URL = window.location.href;
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('article[data-selector=" splp-prd-tl-dsktp"]')[index];
      originalDiv.appendChild(newDiv);
      // originalDiv2.appendChild(newDiv);
      console.log('child appended ' + index);
    }
    const product = document.querySelectorAll('article[data-selector=" splp-prd-tl-dsktp"]');
    // select query selector and loop and add div
    if (product) {
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', URL, i);
      }
    }
    function addHiddenDivDetails (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0');
      originalDiv.appendChild(newDiv);
    }
    const wholeDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0');
    if (wholeDiv) {
      const url = window.location.href;
      addHiddenDivDetails('Prod_url', url);
      addHiddenDivDetails('Search_url', url);
      const thumbnailDetails = document.querySelector('img.met-epc-item');
      // @ts-ignore
      thumbnailDetails && thumbnailDetails.src && addHiddenDivDetails('thumbnailDetails', thumbnailDetails.src);
      const bits = url.split('/');
      const idDetails = bits[bits.length - 1];
      addHiddenDivDetails('idDetails', idDetails);
    }
  });
  await context.evaluate(async function () {
    const URL = window.location.href;
    function addHiddenDiv2 (id, content, index) {
      const newDiv2 = document.createElement('div');
      newDiv2.id = id;
      newDiv2.textContent = content;
      newDiv2.style.display = 'none';
      const originalDiv2 = document.querySelectorAll('div[data-selector="prd-compare-holder"]')[index];
      originalDiv2.appendChild(newDiv2);
      // originalDiv2.appendChild(newDiv);
      console.log('child appended ' + index);
    }
    const product2 = document.querySelectorAll('div[data-selector="prd-compare-holder"]');
    // select query selector and loop and add div
    if (product2) {
      for (let i = 0; i < product2.length; i++) {
        addHiddenDiv2('page_url_1', URL, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    transform: transform,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation,
};
