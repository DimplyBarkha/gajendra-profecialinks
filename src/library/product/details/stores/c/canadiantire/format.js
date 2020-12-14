/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
    for (const { group } of data) {
        for (let row of group) {
            if (row.category) {
                let info = [];
                row.category.forEach(item => {
                    info.push(item.text.trim());
                });
                if (info.length) {
                    row.category = [];
                    info.forEach(item => {
                        row.category.push({ "text": item });
                    });
                }
            }
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    item.text = item.text.match(/\d/g);
                    item.text = String(item.text).replace(/\,/g, '');
                });
            }
            if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {
                    item.text = item.text.match(/\d+\.+\d/);
                    item.text = String(item.text).replace(/\,/g, '');
                });
            }
            if (row.variantCount) {
                var tot = 0;
                row.variantCount.forEach(item => {
                    tot++;
                });
                if (tot == 1) {
                    tot = 0;
                }
                row.variantCount = [{ 'text': tot }];
            }
            if (row.variantInformation) {
                var arr_info = [];
                row.variantInformation.forEach(item => {
                    arr_info.push(item.text)
                });
                row.variantInformation = [{ text: arr_info.join(' | ') }];
            }
            if (row.variants) {
                var arr_info = [];
                row.variants.forEach(item => {
                    arr_info.push(item.text)
                });
                row.variants = [{ text: arr_info.join(' | ') }];
            }
            if (row.descriptionBullets) {
                row.descriptionBullets = [{ 'text': row.descriptionBullets.length, 'xpath': row.descriptionBullets[0].xpath }];
            }
            if (row.availabilityText) {
                console.log(row.availabilityText)
                row.availabilityText.forEach(item => {
                    console.log(item.text)
                    if (item.text >= 1) {
                        item.text = "In Stock"
                        console.log("Sushant="+item.text)
                    }
                    if (item.text == 0) {
                        item.text = "Out of Stock"
                        console.log("Sushant="+item.text)
                    }
                });
            }
            if (row.brandText) {
                let prodBrand;
                let brandInfo = [];
                row.brandText.forEach(item => {
                    if (item.text.length > 30) {
                        let brandObj = JSON.parse(item.text)
                        {
                            prodBrand = brandObj.brand;
                            brandInfo.push(prodBrand);
                        }
                    }
                    else {
                        brandInfo.push(item.text);
                    }
                });
                row.brandText = [{ text: brandInfo[0] }];
            }
            if (row.variantId) {
                var prodCode3;
                let codeInfo = [];
                row.variantId.forEach(item => {
                    let codeObj = JSON.parse(item.text)
                    prodCode3 = codeObj.pCode;
                    codeInfo.push(prodCode3);
                });
                row.variantId = [{ text: codeInfo }];
            }
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text);
                });
                row.description = [{ 'text': info.join(' || '), 'xpath': row.description[0].xpath }];
                row.description[0].text = ' || ' + row.description[0].text;
            }
            if (row.specifications) {
                let info = [];
                row.specifications.forEach(item => {
                    info.push(item.text);
                });
                row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
                row.specifications[0].text = ' || ' + row.specifications[0].text;
            }
            if (row.technicalInformationPdfPresent) {
                row.technicalInformationPdfPresent.forEach(item => {
                    item.text = 'https://www.canadiantire.ca' + item.text
                });
            }
            if (row.videos) {
                let indx1;
                let indx2;
                row.videos.forEach(item => {
                    indx1 = item.text.indexOf('http');
                    indx2 = item.text.indexOf('Flv');
                    item.text = item.text.substring(indx1, indx2).replace('thumbnails', 'videos');
                    item.text = item.text + 'liveclicker.mp4';
                });
            }
            if (row.alternateImages) {
                let info=[];
                row.alternateImages.forEach(item => {
                    info.push(item.text);
                });
                info.shift();
                row.alternateImages = [{ text: info.join(' | ') }];
            }
            if (row.secondaryImageTotal) {
                let info=[];
                row.secondaryImageTotal.forEach(item => {
                    info.push(item.text);
                });
                info.shift();
                row.secondaryImageTotal = [{ 'text': info.length }];
            }
            if (row.weightNet) {
                let info=[];
                row.weightNet.forEach(item => {
                    info.push(item.text);
                });
                row.weightNet = [{ text: info.join(' | ') }];
            }
            if (row.weightGross) {
                let info=[];
                row.weightGross.forEach(item => {
                    info.push(item.text);
                });
                row.weightGross = [{ text: info.join(' | ') }];
            }
            if (row.imageAlt) {
                let indx1;
                let indx2;
                row.imageAlt.forEach(item => {
                    indx1 = item.text.indexOf('alt="');
                    indx2 = item.text.indexOf('src');
                    item.text = item.text.substring(indx1+5, indx2).replace('\"','')
                });
            }
            if (row.mpc) {
                let indx1;
                row.mpc.forEach(item => {
                    indx1 = item.text.indexOf(':');
                    item.text = item.text.substring(indx1+1).replace(' ','')
                });
            }
            if (row.quantity) {
                let indx1;
                row.quantity.forEach(item => {
                    indx1 = item.text.indexOf(':');
                    item.text = item.text.substring(indx1+1).replace(' ','')
                });
            }
            if (row.ingredientsList) {
                let info=[];
                let indx1;
                row.ingredientsList.forEach(item => {
                    indx1 = item.text.indexOf(':');
                    item.text = item.text.substring(indx1+1).replace(' ','')
                    info.push(item.text);
                });
                row.ingredientsList = [{ text: info.join(' , ') }];
            }
            if (row.materials) {
                let info=[];
                row.materials.forEach(item => {
                    info.push(item.text);
                });
                row.materials = [{ text: info.join(' | ') }];
            }
        }
    }
    return cleanUp(data);
};

module.exports = { transform };