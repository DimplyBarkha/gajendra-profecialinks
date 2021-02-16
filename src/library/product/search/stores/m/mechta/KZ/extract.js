const { transform } = require("./format");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "KZ",
    store: "mechta",
    transform,
    domain: "mechta.kz",
    zipcode: "''",
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails }
  ) => {
    await context.evaluate(async () => {
      let apiResults = [];
      const searchUrl = 'https://www.mechta.kz/search/';
      const pageUrl = window.location.href;

      const initialUrl = pageUrl.replace(searchUrl, '');
      let endIdx = initialUrl.indexOf('/#');

      let searchTerm = initialUrl.substring(0, endIdx); //'4k+тв'; //

      console.log('searchTerm :::::::; ', searchTerm);
      const getAPIData = async function (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
        const data = await response.json();
        return data;
      };

      const apiUrl = `https://www.mechta.kz/api/main/catalog_new/index.php?query=${searchTerm}&type=search&page_num=1&catalog=true&page_element_count=9`;
      const response = await getAPIData(apiUrl);
      console.log('response  -=====', response);
      if (response) {
        const data = response.data;
        console.log('data  -=====', data);
        if (data && data.ITEMS) {
          data.ITEMS.forEach(item => {
            const prodId = item.CODE_1C;
            // console.log('prodId  -=====', prodId);
            apiResults.push(prodId);
          });
        }
      }


      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 0;
      while (scrollTop !== 5000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 5000) {
          await stall(500);
          break;
        }
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 1000));

      let index = 1;
      while (index < 10) {
        console.log("index:: ", index);

        let nextScrollTop = 2000;
        let moreButton;
        try {
          moreButton = document.evaluate(
            '//button[contains(@class, "q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        } catch (err) {
          console.log("Error occurred for moreButton : ", err);
        }
        if (moreButton && moreButton.singleNodeValue != null) {
          // console.log("clicking more button for index:: ", index);
          try {
            moreButton.singleNodeValue.click();
            // }catch(e) {}
            // await new Promise((resolve, reject) => setTimeout(resolve, 500));
            let scrollTop = 0;
            let maxScroll = nextScrollTop * index;
            while (scrollTop !== maxScroll) {
              await stall(500);
              scrollTop += 1000;
              // console.log("scrollTop:: ", scrollTop);
              // console.log("nextScrollTop * index:: ", maxScroll);
              window.scroll(0, scrollTop);
              if (scrollTop === maxScroll) {
                await stall(500);
                // console.log("calling  break");
                break;
              }
            }
            const itemCount = 18;
            const apiUrl = `https://www.mechta.kz/api/main/catalog_new/index.php?query=${searchTerm}&type=search&page_num=${index + 1}&catalog=true&page_element_count=${itemCount}`
            console.log('apiUrl  -=====', apiUrl);
            const response = await getAPIData(apiUrl);
            console.log('response  -=====', response);
            if (response) {
              const data = response.data;
              console.log('data1  -=====', data);
              if (data && data.ITEMS) {
                data.ITEMS.forEach(item => {
                  const prodId = item.CODE_1C;
                  // console.log('prodId  -=====', prodId);
                  apiResults.push(prodId);
                });
              }
            }
            index++;
          } catch (e) {}
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        } else {
          index++;
        }
      }

      console.log('apiResults ======== ', apiResults);

      const prodItems = document.querySelectorAll('div.hoverCard-child.bg-white');
      if (prodItems) {
        prodItems.forEach((element, index) => {
          const attrbSelector = element.querySelector('div.q-card');
          const prodId = apiResults[index];
          if (prodId) {
            const idToUse = prodId.slice(prodId.length - 5);
            attrbSelector.setAttribute('my-prodId', idToUse);
          } 
        });
      }
      return apiResults;
    });
    return await context.extract(productDetails, { transform });
  },
};
