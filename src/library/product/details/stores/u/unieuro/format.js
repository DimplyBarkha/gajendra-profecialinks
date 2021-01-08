/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.shippingDimensions) {
                const arr = [];
                row.shippingDimensions.forEach((ele) => {
                    arr.push(ele.text);
                });
                let dimension;
                for (let i = 0; i < 3; i++) {
                    if (arr[i] && i > 0) {
                        dimension = dimension + ' | ' + arr[i];
                    } else if (i === 0) {
                        dimension = arr[0];
                    }
                }
                const ArrOfObj = [row.shippingDimensions[0]];
                ArrOfObj[0].text = dimension;
                row.shippingDimensions = ArrOfObj;
            }
            if (!row.shippingDimensions) {
                if (row.dimensionsProduct) {
                    const arr = [];
                    row.dimensionsProduct.forEach((ele) => {
                        arr.push(ele.text);
                    });
                    let dimension;
                    for (let i = 0; i < 3; i++) {
                        if (arr[i] && i > 0) {
                            dimension = dimension + ' | ' + arr[i];
                        } else if (i === 0) {
                            dimension = arr[0];
                        }
                    }
                    row.shippingDimensions = [row.dimensionsProduct[0]];
                    row.shippingDimensions.forEach(ele => {
                        ele.text = dimension;
                    });
                }
            }

            if (row.price) {
                row.price[0].text = row.price[0].text.replace(/,/g, '.');
                const arr = row.price[0].text.split('.');
                console.log(arr);
                console.log('length : ' + arr.length);
                if (arr.length === 3) {
                    console.log(arr);
                    row.price[0].text = arr[0] + ',' + arr[1] + '.' + arr[2];
                }
            }
            if (row.listPrice) {
                row.listPrice[0].text = row.listPrice[0].text.replace(/,/g, '.');
                const arr = row.listPrice[0].text.split('.');
                console.log(arr);
                console.log('length : ' + arr.length);
                if (arr.length === 3) {
                    console.log(arr);
                    row.listPrice[0].text = arr[0] + ',' + arr[1] + '.' + arr[2];
                }
            }
            if (row.videos) {
                row.videos.forEach((ele) => {
                    ele.text = ele.text.replace(/\\/g, '');
                });
            }
            if (row.aggregateRating) {
                row.aggregateRating.forEach((ele) => {
                    ele.text = ele.text.replace(/,/g, '.');
                });
            }
            if (row.specifications) {
                const nDesc = [];
                let newDesc = '';
                let idx = 0;
                row.specifications.forEach(item => {
                    nDesc[0] = item;
                    if (idx > 0) {
                        newDesc = newDesc + ' || ';
                    }
                    newDesc = newDesc + item.text;
                    idx++;
                });
                console.log(newDesc);
                nDesc.forEach(item => {
                    item.text = newDesc;
                });
                row.specifications = nDesc;
            }
            if (row.description) {
                const nDesc = [];
                let newDesc = '';
                let idx = 0;
                row.description.forEach(item => {
                    nDesc[0] = item;
                    if (idx > 0) {
                        newDesc = newDesc + '||';
                    }
                    newDesc = newDesc + item.text;
                    idx++;
                });
                console.log(newDesc);
                nDesc.forEach(item => {
                    item.text = newDesc;
                });
                row.description = nDesc;
            }
            if (row.videos) {
                if (row.videos.length === 2) {
                    row.videos[0].text = row.videos[0].text + ' | ' + row.videos[1].text;
                    row.videos = [row.videos[0]];
                }
            }
            if (row.manufacturerImages) {
                let manufacturerImgArr = [];
                row.manufacturerImages.forEach(ele => {
                    manufacturerImgArr.push("https:" + ele.text);
                })
                row.manufacturerImages[0].text = manufacturerImgArr.join(" | ")
                row.manufacturerImages = [row.manufacturerImages[0]]
            }
            if (row.manufacturerDescription) {
                row.manufacturerDescription.forEach(ele => {
                    ele.text = ele.text.replace(/(12345[\d]+)/g, '')
                })
            }
        }
    }
    const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
};

module.exports = { transform };