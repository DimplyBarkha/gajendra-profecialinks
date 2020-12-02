const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'SE',
        store: 'kicks',
        transform: transform,
        domain: 'kicks.se',
    },
    implementation,
};
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
        function addElementToDocument(key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        }
        let length = document.querySelectorAll("span[class='eo du']").length
        function addHiddenDiv(id, content, index) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll("span[class='eo du']")[index];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
            }
        for (let product = 0; product < length; product++) {
            let a = document.querySelector('span[class="eo du"]')
            var count = 0;
            for (let c = 0; c < a.childElementCount; c++) {
                if (a.children[c].className == "ep eq") {
                    count++;
                    addHiddenDiv('rating', count);
                }
            }
        }
    });
    return await context.extract(productDetails, { transform });
}