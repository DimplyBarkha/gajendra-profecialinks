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
    function addHiddenDiv(id, content, index) {
        const aggregateRatingXpath = document.querySelectorAll("a[itemscope] > div > span");
        console.log(aggregateRatingXpath);
        const countFinal = [];
        let count = 0;
        for (let i = 0; i <= aggregateRatingXpath.length; i++) {
            const ratingCount = aggregateRatingXpath[i].childNodes.length;
            const ratingName = aggregateRatingXpath[i].childNodes;
            for (let j = 0; j <= ratingCount; j++) {
                // @ts-ignore
                const smileClassName = ratingName[0].className; alert(ratingName[j])
                // @ts-ignore
                const RemainingClassName = ratingName[j].className;
                if (smileClassName == RemainingClassName) {
                    count = count + 1
                }
                countFinal.push(count);
                var test = countFinal.length;
                console.log(countFinal);
                console.log('length' + test)
            }
        }
    }
    });
    return await context.extract(productDetails, { transform });
}