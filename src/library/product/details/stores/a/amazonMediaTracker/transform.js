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
                } else {
                    obj['mediaLocation'] = 'Image not found';
                    arr.push(obj);
                }
            }
        }
        //}

        data[0].group = arr;

        for (row of group) {
            if (row.bannerImage) {
                console.log('Yes')
                row.mediaLocation = 'Banner Image'
            }
            if (row.topCarousel) {
                row.mediaLocation = 'Top Carousel'
            }
        }
    }
    //console.log(arr);
    return data;
};

module.exports = { transform };