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
    var tmpDataLength = data.length
    if (tmpDataLength > 1) {
        var arrSecImg = []
        var arrMfgImg = []
        data.forEach((tmpRow, index) => {
            if (index != 0) {
                data[index].group.forEach(grpRow => {
                    if (grpRow['alternateImages']) {
                        arrSecImg.push(grpRow['alternateImages'][0])
                    }
                    if (grpRow['aplus_images']) {
                        arrMfgImg.push(grpRow['aplus_images'][0])
                    }
                });
            }
        });
        data.splice(1, data.length - 1)
        if (arrSecImg.length) data[0].group[0].alternateImages = Array.from(arrSecImg);
        if (arrMfgImg.length) data[0].group[0].aplus_images = Array.from(arrMfgImg)
    }
    for (const { group } of data) {
        for (const row of group) {
            if (row.videos) {
                let arrVideos = [];
                row.videos.forEach(video => {
                    arrVideos.push(video.text)
                });
                row.videos = [{ "text": arrVideos.join(' | '), "xpath": row.videos[0].xpath }]
            }
            if (row.listPrice) {
                var strListPrice = row.listPrice[0].text
                strListPrice = strListPrice.replace(/Don't pay† /g, '')
                row.listPrice = [{ "text": strListPrice, "xpath": row.listPrice[0].xpath }]
            }
            if (row.price) {
                var strJSONString = ''
                var strPrice = ''
                row.price.forEach(item => {
                    strJSONString = item.text.replace('(function(){ window.__DOMAIN__ = ', '').trim();
                    strJSONString = strJSONString.slice(0, -5);
                    var obj = JSON.parse(strJSONString);
                    if (obj.hasOwnProperty('productPrice')) {
                        strPrice = obj.productPrice
                    }
                })
                row.price = [{ "text": strPrice, "xpath": row.price[0].xpath }]
            }
            if (row.variants) {
                var arrVariants = []
                var countVariant = 0
                if (row.variants.length > 1) {
                    countVariant = row.variants.length
                    row.variants.forEach(variant => {
                        arrVariants.push(variant.text)
                    })
                    row.variants = [{ "text": arrVariants.join(' | '), "xpath": row.variants[0].xpath }]
                }
                row.variantCount = [{ "text": countVariant, "xpath": row.variants[0].xpath }]
            }
            if (row.additionalDescBulletInfo) {
                var strLongDesc = ''
                var strDescBulletCount = 0
                strLongDesc = row.additionalDescBulletInfo[0].text
                strDescBulletCount = (strLongDesc.match(/<li>/ig) || []).length;
                strLongDesc = strLongDesc.replace(/<li>/ig, ' | ')
                strLongDesc = strLongDesc.replace(/(<([^>]+)>)/ig, '')
                row.additionalDescBulletInfo = [{ "text": strLongDesc, "xpath": row.additionalDescBulletInfo[0].xpath }]
                row.descriptionBullets = [{ "text": strDescBulletCount, "xpath": row.additionalDescBulletInfo[0].xpath }]
            }
            if (row.aplus_images) {
                var arrTemp = []
                row.aplus_images.forEach(Images => {
                    arrTemp.push(Images.text)
                })
                row.aplus_images = [{ "text": arrTemp.join(' | '), "xpath": row.aplus_images[0].xpath }]
            }
            if (row.enhanced_content) {
                var arrTemp = []
                row.enhanced_content.forEach(Desc => {
                    arrTemp.push(Desc.text)
                })
                row.enhanced_content = [{ "text": arrTemp.join(' '), "xpath": row.enhanced_content[0].xpath }]
            }
        }
    }
    return cleanUp(data);
};
module.exports = { transform };