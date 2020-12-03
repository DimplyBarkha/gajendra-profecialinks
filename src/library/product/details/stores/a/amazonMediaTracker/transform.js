// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    let arr = [];

    for (let { group }
        of data) {
        for (const row of group) {
            //for (i = 0; i < group.length; i++) {
            for (const [key, value] of Object.entries(row)) {
                let obj = {};
                //obj[key] = value;
                //arr.push(obj);
                if (key == 'bannerImage') {
                    obj['mediaImage'] = value
                    obj['mediaLocation'] = 'Banner Image';
                    arr.push(obj);
                } else if (key == 'topCarousel') {
                    obj['mediaImage'] = value;
                    obj['mediaLocation'] = 'Top Carousel';
                    arr.push(obj);
                } else if (key == 'promoBanner') {
                    obj['mediaImage'] = value;
                    obj['mediaLocation'] = 'Promo Banner';
                    arr.push(obj);
                } else if (key == 'categoryImage') {
                    obj['mediaImage'] = value;
                    obj['mediaLocation'] = 'Category Image';
                    arr.push(obj);
                } else if (key == 'sponsoredImage') {
                    obj['mediaImage'] = value;
                    obj['mediaLocation'] = 'Sponsored Image';
                    arr.push(obj);
                }
            }
        }
        //}
        if (arr.length > 0)
            data[0].group = arr;

        for (row of group) {
            if (row.bannerImage) {
                console.log('Yes')
                row.mediaLocation = 'Banner Image'
            }
            if (row.topCarousel) {
                row.mediaLocation = 'Top Carousel'
            }
            if (row.promoBanner) {
                row.mediaLocation = 'Promo Banner'
            }
            if (row.categoryImage) {
                row.mediaLocation = 'Category Image'
            }
            if (row.sponsoredImage) {
                row.mediaLocation = 'Sponsored Image'
            }
        }
    }
    //console.log(arr);
    return data;
};

module.exports = { transform };