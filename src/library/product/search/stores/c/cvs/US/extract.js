const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  
  /* const hasResults = await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, '//div[contains(@class,"css-1dbjc4n r-ymttw5")]/h4[contains(.,"Sorry")]|//h1[@id="keyword"][contains(.,"No results")]');
  if(!hasResults) {
    return;
  } */
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    
    addHiddenDiv('ii_url', window.location.href);
  });

  console.log('Do pagination');

  await new Promise(resolve => setTimeout(resolve, 8000));

  async function getNumberResultsOnPage () {
    return await context.evaluate(function () {
      const resultXPath = "(//div[@class='css-1dbjc4n r-13awgt0 r-1mlwlqe r-iyfy8q'])[1]//div[@class='css-1dbjc4n']//div[contains(@class,'r-1pi2tsx')]//a"; // list of items on the page from Shaun
      const query = document.evaluate(resultXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const numberPageResults = query.snapshotLength;
      console.log(numberPageResults + 'results on page');
      return numberPageResults;
    });
  }

  async function buttonCheck () {
    return await context.evaluate(function () {
      const button = document.querySelector('div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7');
      if (button != null) {
        return true;
      } else {
        return false;
      }
    });
  }

  async function continuedClickToShowResults () {
    const moreButton = 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7';
    let numberPageResults = 0;
    let count = 0;
    while (numberPageResults <= 150 && count < 200) {
      if (await buttonCheck()) {
        await context.clickAndWaitForNavigation(moreButton, {}, { timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, 10000));
        const prevNumberPageResults = numberPageResults;
        numberPageResults = await getNumberResultsOnPage();
        if (numberPageResults === prevNumberPageResults) {
          numberPageResults = await getNumberResultsOnPage();
        }
        if (numberPageResults === prevNumberPageResults && await buttonCheck()) {
          throw new Error('Not all pages are retrieved');
        }
        console.log(numberPageResults + ' items on page');
        // return await context.extract(productDetails, { transform });
        count++;
      } else {
        numberPageResults = await getNumberResultsOnPage();
        break;
      }
    }
    return numberPageResults;
  }

  const numberPageResults = await continuedClickToShowResults();
  const productsSel = "div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-iyfy8q div.css-1dbjc4n div[class*='r-1pi2tsx'] a";
  const products = await context.evaluate(function (productsSel) {
    const nodes = document.querySelectorAll(productsSel);
    const productIds = [];
    const findStr = 'prodid-';
    nodes.forEach(node => {
      const href = node.getAttribute('href') ? node.getAttribute('href') : '';
      // const img = node.querySelector('img') ? node.querySelector('img').getAttribute('src') : '';
      const price = node.querySelector('div.css-901oao.r-1jn44m2.r-evnaw') ? node.querySelector('div.css-901oao.r-1jn44m2.r-evnaw').textContent.replace('$', '') : '';
      productIds.push(`${href.substr(href.indexOf(findStr) + findStr.length)}|${price}`);
    });
    return productIds;
  }, productsSel);

  if (products && products.length > 0) {
    const productSkus = await context.evaluate(async function getDataFromAPI (products, numberPageResults) {
      // https://www.cvs.com/shop-assets/proxy/search?pageSize=20&fields=["*"]&skip=0&orFields=["id"]&refinements=[{"navigationName":"id","type":"Value","value":"1010438"}]
      const productSkus = [];
      let page = 0;
      while (page < numberPageResults) {
        const url = 'https://www.cvs.com/shop-assets/proxy/search?pageSize=50&fields=%5B%22*%22%5D&skip=0&orFields=%5B%22id%22%5D&refinements=%5B';
        let newUrl = '';

        for (let i = page; i < page + 50; i++) {
          if (products[i] && products[i].split('|')[0]) {
            if (i > page) {
              newUrl = `${newUrl},`;
            }
            newUrl = `${newUrl}{"navigationName":"id","type":"Value","value":"${products[i].split('|')[0]}"}`;
          }
        }
        page += 50;
        newUrl = `${url}${encodeURIComponent(newUrl)}%5D`;
        console.log(newUrl);
        const response = await fetch(newUrl, {
          accept: 'application/json, text/plain, */*',
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });

        if (response && response.status === 404) {
          console.log('Product Not Found!!!!');
          return '';
        }
        if (response && response.status === 200) {
          console.log('Product Found!!!!');
          const json = await response.json();
          if (json && json.records) {
            json.records.forEach(record => {
              if (record.allMeta && record.allMeta.variants) {
                const filteredProduct = products.filter(s => s.includes(record.allMeta.id));
                // const imgUrl = filteredProduct && filteredProduct[0].split('|').length> 0 ? filteredProduct[0].split('|')[1] : '';
                // const variant = imgUrl ? record.allMeta.variants.filter(x=> x.subVariant[0].BV_ImageUrl == imgUrl) : '';
                // const sku = imgUrl && variant[0] ? variant[0].subVariant[0].p_Sku_ID : record.allMeta.gbi_defaultSku;
                const price = filteredProduct && filteredProduct[0] && filteredProduct[0].split('|').length > 0 ? filteredProduct[0].split('|')[1] : '';
                const variant = price ? record.allMeta.variants.filter(x => x.subVariant[0].gbi_Actual_Price === price) : '';
                const sku = price && variant.length === 1 ? variant[0].subVariant[0].p_Sku_ID : record.allMeta.gbi_defaultSku;
                productSkus.push(`${record.allMeta.id}|${sku}`);
              }
            });
          }
        }
      }

      return productSkus;
    }, products, numberPageResults);
    console.log(`productSkus - ${productSkus.length}`)
    if (productSkus && productSkus.length > 0) {
      await context.evaluate(function (productSkus, productsSel) {
        function addHiddenDiv (id, content, parentDiv = null) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          if (!content) content = '';
          newDiv.textContent = content;
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }
        for (let i = 0; i < productSkus.length; i++) {
          const newDivs = document.querySelectorAll(`${productsSel}[href*='${productSkus[i].split('|')[0]}']`);
          newDivs.forEach(newDiv =>  addHiddenDiv('ii_id', productSkus[i].split('|')[1], newDiv));
        }
      }, productSkus, productsSel);
    }
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation,
};
