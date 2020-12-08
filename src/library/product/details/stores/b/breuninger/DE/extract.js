const { cleanUp } = require('../../../../shared');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'breuninger',
        transform: cleanUp,
        domain: 'breuninger.de',
        zipcode: '',
    },

    implementation: async({ inputString }, { country, domain, transform }, context, { productDetails }) => {
        // checking if popup exists and if so, closing it
        var acceptButtonPresent = await context.evaluate(async function() {
            return document.querySelector('button[id="uc-btn-accept-banner"]');
        });
        if (acceptButtonPresent) {
            await context.click('button[id="uc-btn-accept-banner"]');
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
        }
        // manually extracting shippingInfo
        await context.click('div[class*="desktop"]>h2+h2');
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        const shippingInfo = await context.evaluate(async function() {
            return document.querySelector('div[class*="tab-content"]>section').innerText;
        });
        //
        const myUrl = await context.evaluate(async function() {
            return document.querySelector('meta[property="og:url"]').content;
        });
        await context.goto(myUrl);
        await context.waitForNavigation();
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        // checking if popup exists and if so, closing it
        acceptButtonPresent = await context.evaluate(async function() {
            return document.querySelector('button[id="uc-btn-accept-banner"]');
        });
        if (acceptButtonPresent) {
            await context.click('button[id="uc-btn-accept-banner"]');
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
        }
        // checking if down arrow for photos exist and if so, pressing it
        const arrowDownPresent = await context.evaluate(async function() {
            return document.querySelector('div[class*="bewerten-slider"]>svg[class*="arrows--down"]');
        });
        if (arrowDownPresent) {
            await context.click('div[class*="bewerten-slider"]>svg[class*="arrows--down"]');
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
        }
        // extracting data automatically
        await context.extract(productDetails, { transform });
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        // manually extracting description
        const description = await context.evaluate(async function() {
            const descParts = document.querySelectorAll('header+div[class*="bewerten-produkt-detail"]>div[class="bewerten-textformat"]>*');
            var description = '';
            for (let i = 0; i < descParts.length; i++) {
                var bulletPoints = descParts[i].querySelectorAll('li');
                if (bulletPoints.length) {
                    for (let j = 0; j < bulletPoints.length; j++) {
                        description += ' || '
                        description += bulletPoints[j].innerText;
                    }
                } else {
                    description += descParts[i].innerText;
                }
            }
            return description;
        });
        // manually extracting additional description bullet info
        const additionalDescBulletInfo = await context.evaluate(async function() {
            const bulletInfoParts = document.querySelectorAll('div>div[class="bewerten-textformat"]>ul>li');
            var additionalDescBulletInfo = '';
            for (let i = 0; i < bulletInfoParts.length; i++) {
                additionalDescBulletInfo += `|| ${bulletInfoParts[i].innerText} `;
            }
            return additionalDescBulletInfo;
        });
        // manually extracting json stored data
        const jsonData = await context.evaluate(async function() {
            return JSON.parse(document.querySelector('bewerten-vue-data').getAttribute('data-bewerten-json-content'));
        });
        // manually extracting iframe url and navigating to it
        const gotoIframe = await context.evaluate(async function() {
            if (!(document.querySelector('iframe[id=loadbeeIframeId]'))) {
                await new Promise((resolve, reject) => setTimeout(resolve, 100));
            }
            return document.querySelector('iframe[id=loadbeeIframeId]').src;
        });
        await context.goto(gotoIframe);
        await context.waitForNavigation();
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        // manually extracting manufacturer description and images
        const manufacturerDescImg = await context.evaluate(async function() {
            const descParts = document.querySelectorAll('div[class="wrapper preview"]>*');
            const imagesRaw = document.querySelectorAll('div[class="wrapper preview"] img');
            var description = '';
            var images = [];
            for (let i = 0; i < descParts.length; i++) {
                if (descParts[i].innerText === 'Technische Daten') {
                    break;
                }
                description += descParts[i].innerText;
            }
            for (let i = 0; i < imagesRaw.length; i++) {
                images.push(imagesRaw[i].src);
            }
            images = [...new Set(images)];
            return [description, images];
        });
        // manually extracting videos
        var videos = await context.evaluate(async function() {
            var videos = [];
            const rawVideos = document.querySelectorAll('div[data-video]');
            for (let i = 0; i < rawVideos.length; i++) {
                videos.push(rawVideos[i].getAttribute('data-video'));
            }
            return videos;
        });
        // manually extracting iframe data (specifications, weightNet)
        const iframeData = await context.evaluate(async function() {
            var specifications = '';
            var weightNet = '';
            const rawSpecifications = document.querySelectorAll('div[class*="info"]>div[class*="info"]');
            for (let i = 0; i < rawSpecifications.length; i++) {
                if (rawSpecifications[i].querySelector('h5').innerText == 'Gewicht') {
                    weightNet = rawSpecifications[i].querySelector('p').innerText;
                }
                specifications += ` || ${rawSpecifications[i].innerText}`;
            }
            return { specifications: specifications, weightNet: weightNet };
        });
        // inserting manually extracted data to output data ref
        var dataRef = await context.data();
        dataRef[0].data[0].group[0].specifications[0].text = iframeData.specifications;
        dataRef[0].data[0].group[0].weightNet = [{ text: iframeData.weightNet }];
        dataRef[0].data[0].group[0].manufacturerDescription[0].text = manufacturerDescImg[0];
        dataRef[0].data[0].group[0].manufacturerImages = [];
        for (let i = 0; i < manufacturerDescImg[1].length; i++) {
            dataRef[0].data[0].group[0].manufacturerImages.push({ text: manufacturerDescImg[1][i] });
        }
        if ('videos' in dataRef[0].data[0].group[0]) {
            for (let i = 0; i < dataRef[0].data[0].group[0].videos.length; i++) {
                videos.push(dataRef[0].data[0].group[0].videos[i].text)
            }
        }
        console.log(videos);
        videos = [...new Set(videos)];
        dataRef[0].data[0].group[0].videos = [];
        console.log(videos);
        for (let i = 0; i < videos.length; i++) {
            dataRef[0].data[0].group[0].videos.push({ text: videos[i] });
        }
        dataRef[0].data[0].group[0].description[0].text = description;
        dataRef[0].data[0].group[0].additionalDescBulletInfo = [{ text: additionalDescBulletInfo }];
        dataRef[0].data[0].group[0].shippingInfo[0].text = shippingInfo;
        dataRef[0].data[0].group[0].sku[0].text = jsonData.artikelKey;
        if (dataRef[0].data[0].group[0].alternateImages.length + 1 === jsonData.artikel[jsonData.artikelKey].ansichten.length) {
            for (let i = 0; i < dataRef[0].data[0].group[0].alternateImages.length; i++) {
                dataRef[0].data[0].group[0].alternateImages[i].text = jsonData.artikel[jsonData.artikelKey].ansichten[i + 1].zoomUrl;
                delete dataRef[0].data[0].group[0].alternateImages[i].xpath;
            }
            if (!('image' in dataRef[0].data[0].group[0])) {
                dataRef[0].data[0].group[0].image = [];
                dataRef[0].data[0].group[0].image.push({ text: ' ' });
            } else {
                delete dataRef[0].data[0].group[0].image[0].xpath;
            }
            dataRef[0].data[0].group[0].image[0].text = jsonData.artikel[jsonData.artikelKey].ansichten[0].zoomUrl;
        }
        var checkData = await context.evaluate(async function() {
            let getInTheBox = document.querySelector('div.in-the-box img')
            let inTheBoxImages = [];
            let inTheBoxTexts = [];
            if (getInTheBox) {
                let getAllProducts = document.querySelectorAll('div.in-the-box div');
                for (i = 0; i < getAllProducts.length; i++) {
                    inTheBoxImages.push(getAllProducts[i].querySelector('img').getAttribute('src'));
                    inTheBoxTexts.push(getAllProducts[i].querySelector('p').innerText);
                }
                let imagesUrl = inTheBoxImages.join(' || ')
                let imagesText = inTheBoxTexts.join(' || ')
                document.head.setAttribute('intheboxurl', imagesUrl);
                document.head.setAttribute('intheboxtext', imagesText);
            }
            return document.querySelector('div.in-the-box img');
        });
        checkData;
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));

        // const inboxdata = await context.evaluate(async function() {
        //     let imagesUrl = inTheBoxImages.join(' || ')
        //     let imagesText = inTheBoxTexts.join(' || ')
        //     document.head.setAttribute('intheboxurl', imagesUrl);
        //     document.head.setAttribute('intheboxtext', imagesText);
        // });
        //inboxdata;
    },
};