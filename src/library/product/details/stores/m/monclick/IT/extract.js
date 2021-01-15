const { transform } = require('./format');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'IT',
        store: 'monclick',
        transform,
        domain: 'monclick.it',
        zipcode: '',
    },
    implementation: async({ url }, { country, domain, transform }, context, { productDetails }) => {
        
        await new Promise(resolve => setTimeout(resolve, 5000));
            await context.evaluate(async() => {
                async function infiniteScroll () {
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
                }
                await infiniteScroll();
            });
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
                await context.click('div[class*="image-content-gallery"] li[class*="gallery-video"]');
                await context.waitForSelector('div[class*=product-gallery-overlay]');
            } catch (e) {
                console.log(e.message);
            }
            
            try {
                await context.waitForSelector('.syndigo-shadowed-powerpage');
            } catch(err) {
                console.log('got some error while waiting', err.message);
                console.log('waiting again!!');
                try {
                    await context.waitForSelector('.syndigo-shadowed-powerpage');
                } catch(err) {
                    console.log('got some error while waiting -- again', err.message);
                }
            }
            await context.evaluate(async() => {
                let parentDiv = document.querySelectorAll('div[class*="syndi_powerpage"]')[0];
                let isShadowRootLoaded = false;
                let maxWait = 60000;
                let thisTime = 0;
                while(!isShadowRootLoaded) {
                    parentDiv = document.querySelectorAll('div[class*="syndi_powerpage"]')[0];
                    if(parentDiv && parentDiv.shadowRoot) {
                        isShadowRootLoaded = true;
                        console.log('found shadowRoot');
                    } else {
                        thisTime += 2000;
                    }
                    if(thisTime > maxWait) {
                        console.log('waited for a long time!!');
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                parentDiv = document.querySelectorAll('div[class*="syndi_powerpage"]')[0];
                if(parentDiv && parentDiv.shadowRoot) {
                    console.log('shadow root loaded!!');
                } else {
                    console.log('still not loaded');
                }
            });

            await context.evaluate(async() => {
                const element = document.querySelector('footer#footer');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                }
                const syndiPowerpage = document.querySelector('.syndigo-shadowed-powerpage');
                let hasComparisonTable = 'No';
                if (syndiPowerpage) {
                    console.log('Shadow root!');
                    const headings = Array.from(syndiPowerpage.querySelectorAll('h2'));
                    headings.forEach(h2 => {
                        if (h2.innerText.includes('Tabella di comparazione')) {
                            hasComparisonTable = 'Yes';
                        }
                    });
                    document.body.setAttribute('has-comparison-table', hasComparisonTable);
                    let weight = '';
                    try {
                        let weightNetDiv = document.querySelectorAll('div[class*="syndi_powerpage"]')[0];
                        weightNetDiv = weightNetDiv.shadowRoot.querySelector('div[class*="syndi_powerpage"]');
                        let weightElm = document.evaluate('(.//table//tbody//th[contains(.,"Peso")]/..//td)[1]', weightNetDiv, null, 7, null);
                        
                        if(weightElm.snapshotItem(0).textContent) {
                            weight = weightElm.snapshotItem(0).textContent.trim();
                        } else {
                            console.log('weight is not present');
                        }
                    } catch(err) {
                        console.log('we got some erro while getting net weight', err.message);
                    }
                    console.log(weight);
                    document.body.setAttribute('weightnet', weight);
                }
            });
        await new Promise(resolve => setTimeout(resolve, 10000));
        return await context.extract(productDetails, { transform });
    },
};