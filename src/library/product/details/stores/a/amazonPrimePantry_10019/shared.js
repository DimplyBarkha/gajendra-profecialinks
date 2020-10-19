module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function() {
        await new Promise(resolve => setTimeout(resolve, 2814));
        const element = document.getElementById('aplus');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            await new Promise(resolve => setTimeout(resolve, 2197));
        }
        let getSecondaryImageCount = document.querySelectorAll('li.a-spacing-small.item.imageThumbnail.a-declarative')
        let count = 0;
        for (i = 1; i < getSecondaryImageCount.length; i++) {
            count++;
        }
        document.head.setAttribute('count', count)

        function removeDuplicates(array) {
            array.splice(0, array.length, ...(new Set(array)))
        };
        let getRank = document.querySelectorAll('#detailBulletsWrapper_feature_div ul span');
        let rankDetails;
        let product_rank = [];
        let product_rank_category = [];
        getRank.forEach((element) => {
            if (element.innerText && element.innerText.includes('Best Sellers Rank') && element.innerText.includes('#')) {

                rankDetails = element.innerText.split('Best Sellers Rank: ')[1].split('\n');
                if (rankDetails.length) {
                    for (let i = 0; i < rankDetails.length; i++) {
                        product_rank.push(rankDetails[i].split(' ')[0].trim().replace(/#/, '').replace(/,/g, "").trim());
                        product_rank_category.push(rankDetails[i].replace(/^[#,0-9 in]+/, '').trim());
                    }
                }
                console.log(rankDetails)
            }
        });
        removeDuplicates(product_rank);
        removeDuplicates(product_rank_category);
        let rank = product_rank.join(' | ');
        let category = product_rank_category.join(' | ');
        document.head.setAttribute('rank', rank);
        document.head.setAttribute('category', category);
    });
    return await context.extract(productDetails, { transform });
}