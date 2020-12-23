const implementation = async (
  { id },
  parameters,
  context,
  dependencies,
) => {
  function addDynamicTable (jsonData, appendSelector) {
    function generateDynamicTable (jsonData) {
      const dataLength = jsonData.length;
      function checkArray(x) {
        return x.every(i => (typeof i !== "object"));
      }
      if(checkArray(jsonData)) {
        jsonData = jsonData.map((e) => ({'value': e}))
      }
      if (dataLength > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');

        const col = [];
        for (let i = 0; i < dataLength; i++) {
          for (const key in jsonData[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }
        const tHead = document.createElement('thead');
        tHead.setAttribute('bgcolor', '#CCC4F5');
        tHead.style.color = 'black';
        const hRow = document.createElement('tr');

        for (let i = 0; i < col.length; i++) {
          const th = document.createElement('th');
          th.innerHTML = col[i];
          hRow.appendChild(th);
        }
        tHead.appendChild(hRow);
        table.appendChild(tHead);

        const tBody = document.createElement('tbody');

        for (let i = 0; i < dataLength; i++) {
          const bRow = document.createElement('tr');
          for (let j = 0; j < col.length; j++) {
            const td = document.createElement('td');
            table.style.padding = '5px';
            table.style.margin = '5px auto';
            td.setAttribute('class', col[j]);
            if (
              jsonData[i][col[j]] &&
              (jsonData[i][col[j]] !== 'null' ||
                jsonData[i][col[j]] !== 'undefined')
            ) {
              if (typeof jsonData[i][col[j]] === 'object') {
                if (Array.isArray(jsonData[i][col[j]])) {
                  const table = generateDynamicTable(jsonData[i][col[j]]);
                  table && td.append(table);
                } else {
                  const table = generateDynamicTable([jsonData[i][col[j]]]);
                  table && td.append(table);
                }
              } else {
                td.innerHTML = jsonData[i][col[j]];
              }
            }
            bRow.appendChild(td);
            bRow.style.padding = '5px';
          }
          tBody.appendChild(bRow);
        }
        table.appendChild(tBody);
        return table;
      }
    }

    const table = generateDynamicTable(jsonData);
    const container = document.createElement('div');
    container.setAttribute('id', 'added-table');
    container.setAttribute('style', 'height: 1000px;width: 100%;overflow:auto;float: left;position: relative;margin-left: -5px;');
    container.innerHTML = '';
    container.appendChild(table);
    document.querySelector(appendSelector).append(container);
  }

  
  async function getApiData() {
    const productId = window.location.pathname.match(/([^-]+)-pdt.html/)[1];
    const domain = window.location.hostname.replace(/www./,'');
    const API = `https://api.${domain}/store/api/products/${productId}`;
    const res = await fetch(API);
    const json = await res.json();
    return json;
  }
  const apiData = await context.evaluate(getApiData);
  await context.evaluate(addDynamicTable, apiData.payload, '#footer'); 
  const optionalWaitForSelector = async (selector, timeout = 35000) => {
    try {
      await context.waitForSelector(selector, { timeout });
      console.log(`${selector} loaded.`);
      return true;
    } catch (err) {
      console.log(`${selector} never loaded.`);
      return false;
    }
  };

  await optionalWaitForSelector('.shopList .product');

  const readMore = await optionalWaitForSelector('div[data-open-label="Read more"] ~ .long-text-ctl a');

  if (readMore) {
    await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
    const readMore = await context.evaluate(() => {
      return document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a') && document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').innerText === 'Read more';
    });
    if (readMore) {
      await context.evaluate(async() => {
        document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').click();
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        console.log('clicked on read more waiting for 10 sec ');
        await delay(10000);
      });
    }
  }

  const checkExistance = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  const delay = t => new Promise(resolve => setTimeout(resolve, t));

  const currentUrl = await context.evaluate(() => {
    if (document.querySelector('meta[property="og:url"]')) { return document.querySelector('meta[property="og:url"]').getAttribute('content'); }
  });
  const iframeSelector = '#eky-dyson-iframe';
  if (await checkExistance(iframeSelector)) {
    const iframeUrl = await context.evaluate((iframeSelector) => {
      if (document.querySelector(iframeSelector)) { return document.querySelector(iframeSelector).getAttribute('src'); }
    }, iframeSelector);
    await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForXPath('//video');
    await delay(20000);
    const video = await context.evaluate(() => {
      const src = ele('video');
      function ele (tag) {
        return document.querySelectorAll(tag);
      }
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    await context.evaluate(() => {
      const scrollTo = document.querySelector('#specifications');
      scrollTo.scrollIntoView({ behavior: 'smooth' });
    });
    await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
    await delay(20000);
    const images = await context.evaluate(() => {
      const src = document.querySelectorAll('div[class="eky-row left-padding divider-line"] img');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    const desc = await context.evaluate(() => {
      const src = document.querySelectorAll('h1,h2,h3,h4,p,div.eky-accessory>div');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].innerText);
        }
      }
      return value;
    });
    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    const apiData = await context.evaluate(getApiData);
    await context.evaluate(addDynamicTable, apiData.payload, '#footer'); 
    await context.evaluate((video) => {
      video = video.join(' | ');
      document.querySelector('body').setAttribute('video-src', video);
    }, video);
    await context.evaluate((images) => {
      images = images.join(' | ');
      console.log(images);
      const len = images.length;
      if (images[len - 2] === '|') {
        console.log('removing | ');
        images = images.slice(0, len - 3);
      }
      console.log(images);
      document.querySelector('body').setAttribute('img-src', images);
    }, images);
    await context.evaluate((desc) => {
      desc = desc.join(' | ');
      document.querySelector('body').setAttribute('desc', desc);
    }, desc);
  }
  await delay(10000);

  await context.evaluate(async function (zip, country) {
    /* const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
//     .replace(/"\s{1,}/g, '"')
//     .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    function decode(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        })
    }
    async function getBasicDetails() {
      const res = await fetch(window.location.href);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.evaluate(`//*[contains(text(),'"@type": "Product"')]`, doc).iterateNext().textContent
    }
    async function getproductDigitalData() {
      const res = await fetch(window.location.href);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.querySelector('[id="app.digitalData"]').textContent;
    }
    // eslint-disable-next-line
    const basicDetails = JSON.parse(clean(decode(await getBasicDetails())));
    const productDigitalData = JSON.parse(clean(decode(await getproductDigitalData()))).product[0];*/

    const addElement = (id, content) => {
      const packagingElem = document.createElement('div');

      packagingElem.id = id;
      packagingElem.innerText = content;

      document.body.appendChild(packagingElem);
    };

    const makeApiCall = async (url, options) => {
      try {
        console.log(`Making API call to => ${url}`);
        if (!options) {
          options = {
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
          };

          return await (await fetch(url, options)).json();
        }

        return await (await fetch(url, options)).text();
      } catch (err) {
        console.log('Error while making API call.', err);
      }
    };
    const buildDescription = () => {
      const article = document.querySelector('td[class="fullDescription"]');
      let bullets = Array.from(document.querySelectorAll('td[class="mainFeatures"] td[class="value"]')).map(elm => elm.innerText.trim()).join(' || ');
      if(bullets) { bullets = '|| ' + bullets; }else {bullets = ""};
      bullets += article ? ` ${article.textContent.trim()}` : '';
      return bullets.trim();
    };

    const getSpecification = () => {
      const tbodys = document.querySelectorAll('div#tab2 tbody');
      let content = '';
      tbodys.forEach(tb => {
        const trs = tb.querySelectorAll('tr');
        trs.forEach(t => {
          if (content) {
            content += ' || ';
          }
          content += t.querySelector('th').textContent + ' : ' + t.querySelector('td').textContent;
        });
      });

      return content;
    };
  
    addElement('specification', getSpecification());
    const isSelectorPresent = (sel) => {
      return Boolean(document.querySelector(sel));
    };

    const zipInput = isSelectorPresent('div[data-anonid="locationinput"] input[type="search"]');
    const delivery = isSelectorPresent('#delivery.available');
    const outOfStock = isSelectorPresent('.prd-channels .nostock');
    let availability = 'In Stock';

    if (zipInput) {
      let countryRoute = 'https://www.currys.co.uk/gb/uk';
      let long = '-0.106932';
      let lat = '51.508413';

      if (country === 'IE') {
        countryRoute = 'https://www.currys.ie/ie/en';
        long = '-6.26495';
        lat = '53.33537';
      }
      const sku = document.querySelector('td[class="sku"]').innerText;
      const uri = `${countryRoute}/mcd_postcode_check/sProductId/${sku}/sPostCode/${zip}/latitude/${lat}/longitude/${long}/ajax.html`;
      const res = await makeApiCall(uri);
      console.log(res);
      if (res && res.status && res.status === 'success' && res.data && res.data.postCodeCheck && res.data.postCodeCheck.state !== 'DELIVERABLE') {
        availability = 'Out Of Stock';
      }
    } else if (outOfStock) {
      availability = 'Out Of Stock';
    } else if (!delivery) {
      availability = 'Out Of Stock';
    }
    addElement('availability', availability);

    // const actualRating = Number(document.querySelector('td[class="averageScore"]'));
    // const updatedRating = actualRating ? (actualRating * 5) / 10 : '';
    // addElement('rating', updatedRating);

    const productId = document.querySelector('div#added-table > table > tbody > tr > td[class="id"]')  && document.querySelector('div#added-table > table > tbody > tr > td[class="id"]').innerText || '';
    addElement('productId', productId);
    const description = buildDescription();
    addElement('description', description);
  }, parameters.zipcode, parameters.country );
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
};

module.exports = { implementation };