const { transform } = require('../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    context.evaluate(() => {
        document.querySelector('.breadcrumb>li').remove();
        let reviewStars = document.querySelectorAll('.reviews-stars-link__stars'),
            i;
        for (i = 0; i < reviewStars.length; ++i) {
            let htmlText = reviewStars[i].innerHTML;
            let arr = htmlText.match(/star-o/g)
            let arr2 = htmlText.match(/half-o/g)
            let rating = 5
            if (arr) {
                rating = rating - arr.length
            }
            if (arr2) {
                rating = rating - 0.5
            }
            reviewStars[i].innerHTML = '<div class="rating">' + rating + '</div>';
        }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
}
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'AU',
        store: 'thegoodguys',
        transform,
        domain: 'thegoodguys.com.au',
        zipcode: '',
    },
    implementation,
};