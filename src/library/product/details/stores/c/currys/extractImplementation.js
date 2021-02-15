const implementation = async ({ id },
    parameters,
    context,
    dependencies,
) => {
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
  console.log('!!!!!!!!!!!!!!!!!!!!!readmore!!!!!!!!!!!!!!!!!!' + readMore);

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!32!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  if (readMore) {
    await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
    const readMore = await context.evaluate(() => {
      return document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a') && document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').innerText === 'Read more';
    });
    if (readMore) {
      await context.evaluate(() => {
        document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').click();
      });
    }
  }
  const checkExistance = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  const delay = t => new Promise(resolve => setTimeout(resolve, t));

  // check for cookie button -
  const cookieBtnSel = 'button[id*="onetrust-accept-btn-handler"]';
  try {
    await context.waitForSelector(cookieBtnSel);
  } catch (err) {
    console.log('error while waiting for cookie btn', err.message);
  }
  let cookieBtnPresent = await checkExistance(cookieBtnSel);
  if (cookieBtnPresent) {
    console.log('cookie btn is present');
    try {
      await context.click(cookieBtnSel);
    } catch (err) {
      console.log('error while clicking the cookies btn', err.message);
    }
  } else {
    console.log('cookie btn is not present');
  }

  const currentUrl = await context.evaluate(() => {
    if (document.querySelector('meta[property="og:url"]')) { return document.querySelector('meta[property="og:url"]').getAttribute('content'); }
  });
  const iframeSelector = '#eky-dyson-iframe';
  console.log('iframe: ' + iframeSelector);
  if (await checkExistance(iframeSelector)) {
    const iframeUrl = await context.evaluate((iframeSelector) => {
      if (document.querySelector(iframeSelector)) { return document.querySelector(iframeSelector).getAttribute('src'); }
    }, iframeSelector);
    console.log('!!!!!!!!!!!!goto Iframe!!!!!!!!!!!!!!!!!!!!!!!!!');
    // await context.setBypassCSP(true);
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
    let intheboxURL = await context.evaluate(() => {
      console.log('implementing in the box');
      const inthebox = document.querySelectorAll('.eky-accesory-container img');
      intheboxURL = [];
      for (let i = 0; i < inthebox.length; i++) {
        intheboxURL.push(inthebox[i].getAttribute('src'));
      }
      console.log('in the box URL are', intheboxURL);
      return intheboxURL;
    });
    let intheboxText = await context.evaluate(() => {
      console.log('implementing in the box');
      const intheboxtxt = document.querySelectorAll('.eky-accesory-container .eky-accesory-title');
      intheboxText = [];
      for (let i = 0; i < intheboxtxt.length; i++) {
        intheboxText.push(intheboxtxt[i].innerText);
      }
      console.log('in the box URL are', intheboxText);
      return intheboxText;
    });

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
      }
      return value;
    });
    // await context.setBypassCSP(true);
    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await new Promise(resolve => setTimeout(resolve, 15000));
    await context.waitForSelector('#product-info');
    await new Promise(resolve => setTimeout(resolve, 15000));
    await context.evaluate((video) => {
      video = video.join(' | ');
      document.querySelector('body').setAttribute('video-src', video);
    }, video);
    await context.evaluate(async function (intheboxURL, intheboxText) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('intheboxURL', intheboxURL.join(' || '));
      addHiddenDiv('intheboxText', intheboxText.join(' || '));
      console.log('intheboxurl is:', intheboxURL);
    }, intheboxURL, intheboxText);
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
  } else {
    var intheboxText = await context.evaluate(async function () {
      var intheboxText = document.evaluate('//div[@id="tab2"]//th[contains(text(),"Box contents")]/../td', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      intheboxText = intheboxText.innerText.split('\n').join(' || ');
      for (let index = 0; index < intheboxText.match(/-\s/g).length; index++) {
        intheboxText = intheboxText.replace('- ', '');
      }
      return intheboxText;
    });
    await context.evaluate(async function (intheboxText) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // addHiddenDiv('intheboxURL', intheboxURL.join(' || '));
      addHiddenDiv('intheboxText', intheboxText);
      // console.log('intheboxurl is:', intheboxURL);
    }, intheboxText);
  }
  await delay(10000);

  await context.evaluate(async function (zip, country) {
    // eslint-disable-next-line
    var basicDetails = {}
    try {
      basicDetails = JSON.parse(document.evaluate('//script[contains(.,\'"@type": "Product"\')]', document).iterateNext().textContent);
    } catch (error) {
      console.log('error basicDetails: ', error);
    }
    var productDigitalData = {};
    try {
      productDigitalData = JSON.parse(document.querySelector('script[id="app.digitalData"]').textContent).product[0];
    } catch (error) {
      console.log('error productDigitalData: ', error);
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
        const domain = window.location.hostname.replace(/www./, '');
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

    await optionalWaitForSelector('#flix-comp');
    await optionalWaitForSelector('.shopList .product');

    const readMore = await optionalWaitForSelector('div[data-open-label="Read more"] ~ .long-text-ctl a');

    if (readMore) {
        await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
        const readMore = await context.evaluate(() => {
            return document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a') && document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').innerText === 'Read more';
        });
        if (readMore) {
            await context.evaluate(async () => {
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

    const buildDescription = () => {
      const article = document.querySelector('#product-info article');
      const description = document.querySelector('.highlights-tablet .main-desc .section-title ~ ul');
      const subNodes = description ? description.querySelectorAll('li') : '';
      console.log('!!!!!!!!!!!!!!!subnodes: ' + subNodes.length + '!!!!!!!!!!!!!!!');

      let text = '';
      if (subNodes) {
        subNodes.forEach(subNode => {
          text += `||${subNode.textContent}`;
        });
      }

            function retrieve(src) {
                for (let i = 0; i < src.length; i++) {
                    value.push(src[i].currentSrc);
                }
            }
            return value;
        });

    const getSpecification = () => {
      const tbodys = document.querySelectorAll('div#tab2 tbody');
      let content = '';
      if (tbodys.length > 0) {
        tbodys.forEach(tb => {
          const trs = tb.querySelectorAll('tr');
          if (trs) {
            trs.forEach(t => {
              if (t.innerText) {
                content += ' || ';
              }
              try {
                content += t.querySelector('th').textContent + ' : ' + t.querySelector('td').textContent;
              } catch (error) {
                console.log('error 237 : ', error);
              }
            });
          }
        });
      } else { console.log('!!!!!!!!!Tbody: Empty!!!!!!!'); }

            function retrieve(src) {
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

            function retrieve(src) {
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
    try {
        await context.evaluate(async () => {
            async function infiniteScroll() {
                let prevScroll = document.documentElement.scrollTop;
                while (true) {
                    window.scrollBy(0, document.documentElement.clientHeight);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const currentScroll = document.documentElement.scrollTop;
                    if (currentScroll === prevScroll) {
                        break;
                    }
                    prevScroll = currentScroll;
                }
            }
            await infiniteScroll();
        });
        await context.waitForSelector(`div[id="inpage_container"],div[id="inpage_responsive"] div[class*='inpage_selector']`, { timeout: 45000 });
    } catch (error) {
        console.log('Not loading manufacturer description');
    }

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

  try {
    await context.waitForSelector(cookieBtnSel);
  } catch (err) {
    console.log('error while waiting for cookie btn', err.message);
  }
  cookieBtnPresent = await checkExistance(cookieBtnSel);
  if (cookieBtnPresent) {
    console.log('cookie btn is present');
    try {
      await context.click(cookieBtnSel);
    } catch (err) {
      console.log('error while clicking the cookies btn', err.message);
    }
  } else {
    console.log('cookie btn is not present');
  }
  // need to get the videos
  const manufacturerContentVideoSel = 'iframe[title*="Flix-media-video"]';
  try {
    await context.waitForSelector(manufacturerContentVideoSel);
    console.log('we have the video iframe');
  } catch (err) {
    console.log('got some error while waiting for video in manufac-content', err.message);
    try {
      await context.waitForSelector(manufacturerContentVideoSel);
      console.log('we have the video iframe');
    } catch (err) {
      console.log('got some error while waiting for video in manufac-content -- again', err.message);
    }
  }

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      async function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('waiting!!');
            resolve();
          }, ms);
        });
      }
      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        console.log('scrolling now!!');
        if (scrollTop === 15000) {
          await stall(3000);
          break;
        }
      }
    });
  };

  await applyScroll(context);

  await context.evaluate(async (manufacturerContentVideoSel) => {
    let videoUrlArr = [];
    const allVideoElms = document.querySelectorAll(manufacturerContentVideoSel);
    if ((!allVideoElms) || (allVideoElms.length === 0)) {
      return;
    }

    for (let i = 0; i < allVideoElms.length; i++) {
      let thisUrl = '';
      if (allVideoElms[i].hasAttribute('src')) {
        thisUrl = allVideoElms[i].getAttribute('src');
      } else if (allVideoElms[i].hasAttribute('_src')) {
        thisUrl = allVideoElms[i].getAttribute('_src');
      } else {
        console.log('we do not have src or _src for ' + i + 'th iframe');
      }
      console.log(thisUrl);
      videoUrlArr.push(thisUrl);
    }

    const videoSet = new Set(videoUrlArr);
    console.log('we got ' + videoSet.size + ' unique elements');
    videoUrlArr = Array.from(videoSet);

    async function addElementToDocumentAsync (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      document.body.appendChild(catElement);
    }

    await addElementToDocumentAsync('manufacvideos', videoUrlArr.join(' || '));
  },
  manufacturerContentVideoSel);

  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!EXTRACTION COMPLETE!!!!!!!!!!!!!!!!!!!!');
  return await context.extract(productDetails, { transform });
};

module.exports = { implementation };