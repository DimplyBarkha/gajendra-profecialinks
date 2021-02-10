const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
        
    await context.evaluate(async () => {
     
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      

      let scrollTop = 0;
      // while (scrollTop !== 5000) {
      //   await stall(500);
      //   scrollTop += 500;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 5000) {
      //     await stall(1000);
      //     break;
      //   }
      // }
      
      
      
      // const moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      let moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button[contains(@class,"Button-sc-1o0ywp5-0")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log('moreButton:: ', moreButton.singleNodeValue);
      let apiData = [];
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        
        while (index < 7) {
          try {
            
            index++;
            moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button[contains(@class,"Button-sc-1o0ywp5-0")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            moreButton.singleNodeValue.click();
            console.log('more button clicked: ', index - 1);
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            let scrollTop = 0;
            while (scrollTop !== 10000) {
              await stall(500);
              scrollTop += 2000;
              window.scroll(0, scrollTop);
              if (scrollTop === 10000) {
                await stall(500);
                break;
              }
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            console.log("index::::::::: ", index)
            const data = await fetchProducts(index);
            console.log("data:: ", data.length)
            apiData.push(...data);
            // apiData = [...apiData, data];
            console.log("apiData:: ", apiData.length)
          } catch (e) {
            // console.log('error on more button: ', e);
          }
        }
        
      }
      // call Add image div      
      addAllHiddenDiv(apiData);
      

      /////////
      function addHiddenDiv (i, productCards, productInfo) {
        const newDiv = document.createElement('div');
        newDiv.id = i+'_extra-info';
        newDiv.className = 'extra-info';
        newDiv.style.display = 'none';
        if (productInfo && productInfo[i]) {
          // console.log("productInfo[i]:: ", i, productInfo[i]);
          newDiv.dataset.productid = productInfo[i].id ? productInfo[i].id : '';
          // newDiv.dataset.productUrl = productInfo[i].url ? productInfo[i].url : '';
          // newDiv.dataset.productPrice = productInfo[i].price ? productInfo[i].price : '';
          // newDiv.dataset.productName = productInfo[i].name ? productInfo[i].name : '';
          // newDiv.dataset.reviewCount = productInfo[i].details.ratingComents ? productInfo[i].details.ratingComents[0] : '';
          // newDiv.dataset.ratingCount = productInfo[i].details.ratingComents ? productInfo[i].details.ratingComents[0] : '';
          // newDiv.dataset.aggregateRating = productInfo[i].details.rating ? productInfo[i].details.rating[0] : '';
          

          newDiv.dataset.thumbnail = productInfo[i].images ? productInfo[i].images.default : ""; // ? 'https://www.foodservicedirect.com/media/catalog/product/' + productInfo[i].thumbnail_image : '';
          // newDiv.innerText =productInfo[i].id ? productInfo[i].id : '';
        }
        productCards.item(i).appendChild(newDiv);
      }

      async function fetchProducts (pageNum) {
        const refURL = window.location.href;
      
        console.log("refURL:: ", refURL);
        //match('br\W([^\W]+)');
        const searchTermArr = refURL.split("/");
        const searchTerm = searchTermArr[searchTermArr.length -2]
        console.log("searchTerm:: ", searchTerm);
  
        // const search = (document.querySelector('.c-list-view-settings__list-info') && document.querySelector('.c-list-view-settings__list-info').querySelectorAll('strong')[1]) ? document.querySelector('.c-list-view-settings__list-info').querySelectorAll('strong')[1].textContent : '';
        const fetchURL = `https://prd-api-partner.viavarejo.com.br/api/search?resultsPerPage=21&terms=${searchTerm}&page=${pageNum}&salesChannel=desktop&apiKey=casasbahia`;
        // const fetchURL = `https://search.unbxd.io/ed39b885dbb44eca3c2782623eb2ba9d/www-foodservicedirect-com-805741548149387/search?q=${search}&rows=32&format=json&f.categoryPath.nameId=false&filter=product_websites:%22base%22&start=${pageNum}`;
        console.log('fetchURL: ', fetchURL);
  
        const response = await fetch(fetchURL, {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'script',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
          },
          referrer: refURL,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });
  
        if (response && response.status === 400) {
          throw new Error('Error when calling API');
        }
  
        if (response && response.status === 404) {
          console.log('Product Not Found!!!!');
        }
  
        if (response && response.status === 200) {
         
          const data = await response.json();
          // console.log('Product Found!!!!', data.products);
         
          return data.products;
        }
      }

      async function addAllHiddenDiv (productInfo) {
        // const productCards = document. getElementsByClassName('ProductCard__Wrapper-sc-2vuvzo-6 iWpyBK');
        const productCards = document.querySelectorAll('ul[class*="ProductsGrid__ProductsGridWrapper"] li');
        console.log("productCards:: ", productCards.length);
        console.log("productInfo:: ", productInfo.length);
        let i = 0;
        while (i < productCards.length) {
          if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
            document.getElementById(i.toString()).remove();
          }
          await addHiddenDiv(i, productCards, productInfo);
          i++;
         
        }
      }
      
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
