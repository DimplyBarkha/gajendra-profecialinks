const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    transform,
    domain: 'expertonline.it',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(error);
    }
    // ------------------------------------
    const nextLink = document.querySelectorAll('ul.pagination');
    let nextSibling;
    if (nextLink !== undefined && nextLink) {
      let ul;
      if (nextLink.length > 0) {
        ul = nextLink[0];
      } else if (nextLink.length === 1) {
        ul = nextLink[0];
      }
      // const finalUl = ul;
      const activeUl = ul ? ul.querySelector('li.active') : '';
      if (activeUl !== undefined) {
        // @ts-ignore
        nextSibling = activeUl ? activeUl.nextElementSibling : '';
      }
      console.log('nextSibling: ', nextSibling);
    } else {
      console.log('nextSibling not found');
    }

    function addDiv (id, content) {
      const newDiv = document.createElement('a');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.href = content;
      document.body.appendChild(newDiv);
    }
    // @ts-ignore
    if (nextSibling) {
      let hrefLink = nextSibling ? nextSibling.querySelector('a') : '';
      // @ts-ignore
      hrefLink = hrefLink ? hrefLink.href : '';
      // @ts-ignore
      if (!hrefLink.includes('https://www.')) {
        hrefLink = 'https://www.expertonline.it' + hrefLink;
      }
      // @ts-ignore
      if (nextSibling.innerText === '»') {
        console.log('Next link is last');
      } else {
        console.log(`nextLinkSelector: ${hrefLink}`);
        addDiv('nextLinkSelector', hrefLink);
      }
    }
    // -----------------------------------------------------------------------
    async function infiniteScroll () {
      console.log('Doing infinite scroll..');
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
      console.log('Infinite scroll over..');
    }
    await infiniteScroll();
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(error);
    }
    // -------------------------------------
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[id="app"] div.skywalker_riga div.articolo_riga_bkg')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const ids = document.querySelectorAll('div[id="app"] div.skywalker_riga');
    const idsArr = [];
    for (let index = 0; index < ids.length; index++) {
      // console.log('lis.length: ', lis.length);
      const element = ids[index];
      console.log('element: ', element, index);
      let id = element.getAttribute('data-codiceextra');
      if (!id.includes('PROD')) {
        id = 'PROD_' + id;
      }
      idsArr.push(id);
    }
    console.log('idsArr:', idsArr);
    let JSONArr;
    if (idsArr.length > 0) {
      JSONArr = await callPost(idsArr);
    }
    async function callPost (idsArr) {
      const url = 'https://www.expertonline.it/svc/ServizioReviews.svc/Reviews/GetCounters';
      // let ids = ["PROD_Expert_702207", "PROD_Expert_701770", "PROD_Expert_603983", "PROD_Expert_615091"];
      const ids = idsArr;
      const data = {
        ContentIds: ids,
        ReviewTypes: '',
        Language: '',
      };
      const otherParams = {
        headers: { 'content-type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data),
        method: 'POST',
        mode: 'cors',
      };

      // @ts-ignore
      return fetch(url, otherParams)
        .then(async function (response) {
          console.log('response: ', response);
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData.Value.Counters);
            return responseData;
          } else {
            throw new Error('Could not reach the API: ' + response.statusText);
          }
        }).then(function (data) {
          console.log('data: ', data);
          return data;
        }).catch(function (error) {
          console.log('error: ', error);
          return error;
        });
      // return false;
    }
    let ratingReviewObj = JSONArr ? JSONArr.Value : '';
    ratingReviewObj = ratingReviewObj ? ratingReviewObj.Counters : '';
    const lis = document.querySelectorAll('div[id="app"] div.skywalker_riga');
    for (let index = 0; index < lis.length; index++) {
      // console.log('lis.length: ', lis.length);
      const element = lis[index];
      console.log('element: ', element, index);
      let id = element.getAttribute('data-codiceextra');
      if (!id.includes('PROD')) {
        id = 'PROD_' + id;
      }
      // console.log(id);
      ratingReviewObj.find(param => {
        console.log('param: ', param, id);
        if (param) {
          // @ts-ignore
          if (param.SubjectKey === id) {
            console.log('param.SubjectKey: ', param.SubjectKey);
            console.log('id: ', id);
            console.log('Matched');
            addHiddenDiv('pd_productRating', param.TotalScore.toFixed(1), index);
          }
        }
      });
    }
    // -------------------------------------
  });

  return await context.extract(productDetails, { transform });
}
