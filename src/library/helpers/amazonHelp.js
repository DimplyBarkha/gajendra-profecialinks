module.exports.AmazonHelp = class {
    constructor(context, helpers) {
        this.context = context;
        this.helpers = helpers;
    }

    // Function which sets the locale on amazon.com
    async setLocale(wantedZip) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const shouldChangeAddress = await this.helpers.checkAndReturnProp('div#nav-global-location-slot', 'css', 'innerText');

        if (shouldChangeAddress && shouldChangeAddress.includes(wantedZip)) return;

        try {
            await this.helpers.checkAndClick('span#glow-ingress-line2.nav-line-2', 'css', 6000);
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await this.helpers.checkAndClick('a#GLUXChangePostalCodeLink', 'css', 6000);
            } catch (e) {}
            await this.helpers.checkAndClick('input[aria-label="or enter a US zip code"]', 'css', 6000, wantedZip);
            await this.helpers.checkAndClick('input[aria-labelledby="GLUXZipUpdate-announce"]', 'css', 6000);
            await this.context.evaluate(async function() {
                if (document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]')) {
                    document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]').click();
                }
            });
            await this.helpers.checkAndClick('button[name="glowDoneButton"]', 'css', 6000);
        } catch (exception) {
            console.log('Failed to update zipcode!');
            throw exception;
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // get array of all other variant codes on the page
    async getVariants() {
        return await this.context.evaluate(() => {
            const variantList = [];
            const variantCards = document.querySelectorAll('li[data-defaultasin]');
            const variantDropdown = document.querySelectorAll('[id*="variation"] option');
            const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');

            if (variantBooks) {
                for (let i = 0; i < variantBooks.length; i++) {
                    const element = variantBooks[i];
                    if (element == null) {
                        continue;
                    }
                    const vasinRaw = element.getAttribute('href');
                    if (vasinRaw !== '') {
                        const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
                        const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
                        if (vasin !== '') {
                            variantList.push(vasin);
                        }
                    }
                }
            }
            if (variantDropdown) {
                for (let i = 0; i < variantDropdown.length; i++) {
                    const element = variantDropdown[i];
                    if (element == null) {
                        continue;
                    }
                    const vasinRaw = element.getAttribute('value');
                    if (vasinRaw !== '') {
                        const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
                        const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
                        if (vasin !== '') {
                            variantList.push(vasin);
                        }
                    }
                }
            }
            if (variantCards) {
                for (let i = 0; i < variantCards.length; i++) {
                    const element = variantCards[i];
                    if (element == null) {
                        continue;
                    }
                    let vasin = element.getAttribute('data-dp-url');
                    if (vasin && vasin.includes('/dp/') && vasin.includes('/ref=')) {
                        const vasinArr = vasin.split('/dp/');
                        vasin = vasinArr.length === 2 ? vasinArr[1].split('/ref=')[0] : '';
                        if (vasin !== '') {
                            variantList.push(vasin);
                        }
                    } else {
                        vasin = element.getAttribute('data-defaultasin');
                    }
                }
            }
            return variantList;
        });
    }

    async appendData() {
        return await this.context.evaluate(async() => {
            const domain = window.location;
            const getParams = async() => {
                const paramLocators = [
                    'pgid',
                    'sid',
                    'rid',
                    'ptd',
                    'storeID',
                    'parent_asin',
                    'current_asin',
                ];
                const params = {};
                const raw = document.evaluate("//script[contains(@language,'JavaScript') and contains(text(), 'pgid')  and  contains(text(), 'current_asin')]", document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
                if (raw) {
                    paramLocators.forEach(param => {
                        if (raw.innerText.includes(param)) {
                            const regex = new RegExp(`${param}":"([^"]+)`, 's');
                            const paramMatch = raw.innerText.match(regex);
                            const paramClean = paramMatch && paramMatch.length > 1 ? paramMatch[1] : false;
                            if (paramClean) {
                                params[`${param}`] = paramClean;
                            }
                        }
                    });
                }
                console.log('params', params);
                return params;
            };
            const params = await getParams();
            if (Object.keys(params).length === 7) {
                let url;
                if (domain.hostname.includes('com')) {
                    url = `https://${domain.hostname}/gp/page/refresh?acAsin=${params.current_asin}&asinList=${params.current_asin}&auiAjax=1&dpEnvironment=softlines&dpxAjaxFlag=1&ee=2&enPre=1&id=${params.current_asin}&isFlushing=2&isP=1&isUDPFlag=1&json=1&mType=full&parentAsin=${params.parent_asin ? params.parent_asin : params.current_asin}&pgid=${params.pgid}&psc=1&ptd=${params.ptd}&rid=${params.rid}=1&sCac=1&sid=${params.sid}&storeID=${params.storeID}&triggerEvent=Twister&twisterView=glance`;
                } else {
                    url = `https://${domain.hostname}/gp/twister/ajaxv2?acAsin=${params.current_asin}&sid=${params.sid}&ptd=${params.ptd}&sCac=1&twisterView=glance&pgid=${params.pgid}&rid=${params.rid}&dStr=size_name&auiAjax=1&json=1&dpxAjaxFlag=1&isUDPFlag=1&ee=2&parentAsin=${params.parent_asin ? params.parent_asin : params.current_asin}&enPre=1&dcm=1&udpWeblabState=T1&storeID=${params.storeID}&ppw=&ppl=&isFlushing=2&dpEnvironment=hardlines&asinList=${params.current_asin}&id=${params.current_asin}&mType=full&psc=1`;
                }
                const parseResponse = (blob) => {
                    const dataBlobs = blob.split('&&&').map(part => part.trim()).filter(part => part.length > 0).map(part => JSON.parse(part));
                    return dataBlobs;
                };
                const dataRaw = await fetch(url)
                    .then(response => response.text())
                    .then(blob => parseResponse(blob));
                console.log('# elements attempting to append: ', dataRaw.length);
                dataRaw.forEach(part => {
                    const element = document.getElementById(Object.keys(part.Value.content)[0]);
                    if (element) {
                        // element.innerHTML = Object.values(part.Value.content)[0]
                    } else {
                        const div = document.createElement('div');
                        div.innerHTML = Object.values(part.Value.content)[0];
                        document.body.appendChild(div);
                    }
                });
                return true;
            } else { return false; }
        });
    }

    async addEnhancedContent() {
        const enhancedContent = await this.context.evaluate(async function() {
            let allText = '';
            [...document.querySelectorAll('div.apm-hovermodule-slides')].filter(element => element.style.display !== 'block').forEach((element) => {
                if (element.querySelector('.apm-hovermodule-slides-inner')) {
                    allText += element.querySelector('.apm-hovermodule-slides-inner').innerText;
                }
            });
            return document.querySelector('div#aplus') ? document.querySelector('div#aplus').innerText + allText : '';
        });
        await this.helpers.addItemToDocument('added-enhanced-content', enhancedContent);
    }

    async addCurrentSellerInfo(soldByAmazon, soldByAmazonRegex) {
        let CurrentSeller = await this.context.evaluate(async function() {
            return document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
        });

        const CurrentSellerPrice = await this.context.evaluate(async function() {
            return document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
        });

        let CurrentSellerShipping = await this.context.evaluate(async function() {
            return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
        });

        let CurrentSellerPrime = await this.context.evaluate(async function() {
            return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
        });

        if (CurrentSeller && CurrentSeller.search(soldByAmazon) < 0 && CurrentSeller.match(soldByAmazonRegex)) {
            CurrentSeller = (CurrentSeller.match(soldByAmazonRegex)[1]) ? CurrentSeller.match(soldByAmazonRegex)[1] : CurrentSeller.match(soldByAmazonRegex)[2];
            if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
            if (CurrentSellerPrime.includes('Details')) {
                CurrentSellerPrime = 'YES';
            } else {
                CurrentSellerPrime = 'NO';
            }

            await this.helpers.addItemToDocument('ii_otherSellersName', CurrentSeller);
            await this.helpers.addItemToDocument('ii_otherSellersPrice', CurrentSellerPrice);
            await this.helpers.addItemToDocument('ii_otherSellersShipping', CurrentSellerShipping);
            await this.helpers.addItemToDocument('ii_otherSellersPrime', CurrentSellerPrime);
            console.log('CurrentSeller', CurrentSeller);
            console.log('CurrentSellerPrice', CurrentSellerPrice);
            console.log('CurrentSellerShipping', CurrentSellerShipping);
            console.log('CurrentSellerPrime', CurrentSellerPrime);
        }
    }
};