const { transform } = require('../format');
async function implementation(
    // @ts-ignore
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const variants = await context.evaluate(async function () {
        const serverData = document.querySelector('script#__serverData');
        if (serverData) {
            let data = JSON.parse(serverData.textContent);
            if (data.variations && data.variations.length > 0) {
                return data.variations;
            } else {
                return null
            }
        }
    });

    if (variants) {
        let i = 0;
        for (i = 0; i < variants.length; i++) {
            let variant = variants[i];
            if (!variant.link) {
                continue;
            }

            await context.goto(`https://en-ae.namshi.com${variant.link}`, { timeout: 10000, waitUntil: 'load' });
            const sizeOfDiv = await context.evaluate(function () {
                function addHiddenDiv(id, content, availability, itemNo, rpc, size) {
                    const newDiv = document.createElement('div');
                    newDiv.id = id;
                    newDiv.textContent = content;
                    newDiv.setAttribute('availability', availability);
                    newDiv.setAttribute('itemNo', itemNo);
                    newDiv.setAttribute('rpc', rpc);
                    newDiv.setAttribute('size', size);
                    newDiv.style.display = 'none';
                    document.body.appendChild(newDiv);
                }
                if (document.querySelectorAll('div[class*="product_description"] div[class*="info_shortdescription"] li')) {
                    let prodDesc = '';
                    const descRows = document.querySelectorAll('div[class*="product_description"] div[class*="info_shortdescription"] li');
                    for (let i = 0; i < descRows.length; i++) {
                        prodDesc += descRows[i].innerText + ' || ';
                    }
                    console.log('prod desc is ' + prodDesc);
                    addHiddenDiv('prodDesc', prodDesc);
                }
                // div[contains(@class,"product_description")]//div[contains(@class,"info_shortdescription")]//li
                let sku = document.URL.substring(document.URL.lastIndexOf('-'), document.URL.length);
                sku = sku.replace(/(-)(.+)(.html)/g, '$2');
                addHiddenDiv('skuDiv', sku);
                const brandName = document.querySelector('h2.product__brandname').innerText;
                const prodName = document.querySelector('h1.product__name').innerText;
                const serverData = document.querySelector('script#__serverData');
                const serverObj = JSON.parse(serverData.innerText.trim());
                const rpcArray = serverObj.simples;
                for (let i = 0; i < rpcArray.length; i++) {
                    const prodFullName = brandName + ' ' + prodName;
                    // prodFullName += ' ' + rpcArray[i].size;
                    //const rpc = rpcArray[i].sku;
                    let rpc = null;
                    let prodCode = rpcArray[i].sku.includes("-") ? rpcArray[i].sku.split('-')[0] : rpcArray[i].sku;
                    if (rpcArray[i].size) {
                        rpc = prodCode + `-` + rpcArray[i].size;
                    } else {
                        rpc = prodCode;
                    }
                    if (rpcArray[i].quantity !== 0) addHiddenDiv('descDiv', prodFullName, 'In Stock', i, rpc, rpcArray[i].size);
                    else addHiddenDiv('descDiv', prodFullName, 'Out Of Stock', i, rpc, rpcArray[i].size);
                }
                return rpcArray.length;
            });
            if (sizeOfDiv !== 0) {
                for (let i = 0; i < sizeOfDiv; i++) {
                    await context.evaluate(function (i) {
                        function addHiddenDiv(id, content, availability, rpc, size) {
                            const newDiv = document.createElement('div');
                            newDiv.id = id;
                            newDiv.textContent = content;
                            newDiv.setAttribute('availability', availability);
                            newDiv.setAttribute('retailerProdCode', rpc);
                            newDiv.setAttribute('size', size);
                            newDiv.style.display = 'none';
                            document.body.appendChild(newDiv);
                        }
                        const currentDiv = `div[itemNo="${i}"]`;
                        const currentDivSelector = document.querySelector(currentDiv);
                        const content = currentDivSelector.innerText;
                        const availability = currentDivSelector.getAttribute('availability');
                        const rpc = currentDivSelector.getAttribute('rpc');
                        const size = currentDivSelector.getAttribute('size');
                        addHiddenDiv('currentDiv', content, availability, rpc, size);
                    }, i);
                    await context.extract(productDetails, { transform });
                    await context.evaluate(function () {
                        document.querySelector('div#currentDiv').remove();
                    });
                }
            } else {
                const { transform } = parameters;
                const { productDetails } = dependencies;
                await context.extract(productDetails, { transform });
            }
        }
    } else {
        const sizeOfDiv = await context.evaluate(function () {
            function addHiddenDiv(id, content, availability, itemNo, rpc, size) {
                const newDiv = document.createElement('div');
                newDiv.id = id;
                newDiv.textContent = content;
                newDiv.setAttribute('availability', availability);
                newDiv.setAttribute('itemNo', itemNo);
                newDiv.setAttribute('rpc', rpc);
                newDiv.setAttribute('size', size);
                newDiv.style.display = 'none';
                document.body.appendChild(newDiv);
            }
            if (document.querySelectorAll('div[class*="product_description"] div[class*="info_shortdescription"] li')) {
                let prodDesc = '';
                const descRows = document.querySelectorAll('div[class*="product_description"] div[class*="info_shortdescription"] li');
                for (let i = 0; i < descRows.length; i++) {
                    prodDesc += descRows[i].innerText + ' || ';
                }
                console.log('prod desc is ' + prodDesc);
                addHiddenDiv('prodDesc', prodDesc);
            }
            // div[contains(@class,"product_description")]//div[contains(@class,"info_shortdescription")]//li
            let sku = document.URL.substring(document.URL.lastIndexOf('-'), document.URL.length);
            sku = sku.replace(/(-)(.+)(.html)/g, '$2');
            addHiddenDiv('skuDiv', sku);
            const brandName = document.querySelector('h2.product__brandname').innerText;
            const prodName = document.querySelector('h1.product__name').innerText;
            const serverData = document.querySelector('script#__serverData');
            const serverObj = JSON.parse(serverData.innerText.trim());
            const rpcArray = serverObj.simples;
            for (let i = 0; i < rpcArray.length; i++) {
                const prodFullName = brandName + ' ' + prodName;
                // prodFullName += ' ' + rpcArray[i].size;
                //const rpc = rpcArray[i].sku;
                let rpc = null;
                let prodCode = rpcArray[i].sku.includes("-") ? rpcArray[i].sku.split('-')[0] : rpcArray[i].sku;
                if (rpcArray[i].size) {
                    rpc = prodCode + `-` + rpcArray[i].size;
                } else {
                    rpc = prodCode;
                }
                if (rpcArray[i].quantity !== 0) addHiddenDiv('descDiv', prodFullName, 'In Stock', i, rpc, rpcArray[i].size);
                else addHiddenDiv('descDiv', prodFullName, 'Out Of Stock', i, rpc, rpcArray[i].size);
            }
            return rpcArray.length;
        });
        if (sizeOfDiv !== 0) {
            for (let i = 0; i < sizeOfDiv; i++) {
                await context.evaluate(function (i) {
                    function addHiddenDiv(id, content, availability, rpc, size) {
                        const newDiv = document.createElement('div');
                        newDiv.id = id;
                        newDiv.textContent = content;
                        newDiv.setAttribute('availability', availability);
                        newDiv.setAttribute('retailerProdCode', rpc);
                        newDiv.setAttribute('size', size);
                        newDiv.style.display = 'none';
                        document.body.appendChild(newDiv);
                    }
                    const currentDiv = `div[itemNo="${i}"]`;
                    const currentDivSelector = document.querySelector(currentDiv);
                    const content = currentDivSelector.innerText;
                    const availability = currentDivSelector.getAttribute('availability');
                    const rpc = currentDivSelector.getAttribute('rpc');
                    const size = currentDivSelector.getAttribute('size');
                    addHiddenDiv('currentDiv', content, availability, rpc, size);
                }, i);
                await context.extract(productDetails, { transform });
                await context.evaluate(function () {
                    document.querySelector('div#currentDiv').remove();
                });
            }
        } else {
            const { transform } = parameters;
            const { productDetails } = dependencies;
            await context.extract(productDetails, { transform });
        }

    }
}
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AE',
        store: 'namshi',
        transform,
        domain: 'namshi.com',
        zipcode: "''",
    },
    implementation,
};
