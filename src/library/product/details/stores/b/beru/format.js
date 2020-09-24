/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.variants) {
                const variantArray = row.variants.map((item) => {
                    return item.text;
                });
                row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
            }
            if (row.color) {
                var colors = ['красный', 'серый', 'белый', 'серебристый', 'синий', 'коричневый', 'желтый', 'черный', 'розовый', 'зеленый', 'фиолетовый'];
                const colorArray = row.color.map((item) => {
                    var colorArr = item.text.split(' ');
                    var finalColor = '';
                    for (var clr of colorArr) {
                        if (colors.includes(clr)) {
                            finalColor = +' ' + clr;
                        }
                    }
                    return finalColor;
                });
                row.color = [{ text: colorArray.join(' '), xpath: row.color[0].xpath }];
            }
            if (row.promotion) {
                console.log('Promotion ', row.promotion);
                const promotionTextArray = row.promotion.map((item) => {
                    return item.text;
                });
                if (promotionTextArray.length) {
                    row.promotion = [{ text: promotionTextArray[0] + '%' }];
                }
            }
            if (row.additionalDescBulletInfo) {
                let additionalDescBulletInfoArr = [];
                additionalDescBulletInfoArr.push('|| ');
                additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
                    return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' | ') : '';
                });
                console.log('AdBuIn', additionalDescBulletInfoArr);
                additionalDescBulletInfoArr.unshift('|');
                additionalDescBulletInfoArr.push('|');
                // for (let i = 0; i < specificationArray.length; i += 2) {
                //   let j = i;
                //   formattedSpecification.push(`${specificationArray[i]}:${specificationArray[++j]}`);
                // }
                row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
                console.log('row.additionalDescBulletInfo', row.additionalDescBulletInfo);
            }
            if (row.alternateImages) {
                row.alternateImages && row.alternateImages.shift();
            }
            if (row.specifications) {
                const formattedSpecification = [];
                const specificationText = row.specifications.map((item) => {
                    return item.text;
                });
                const specificationArray = specificationText[0].split('\n');
                formattedSpecification.push(`${specificationArray[0]}`);
                specificationArray.shift();
                for (let i = 0; i < specificationArray.length; i += 2) {
                    let j = i;
                    formattedSpecification.push(`${specificationArray[i]}:${specificationArray[++j]}`);
                }
                row.specifications = [{ text: formattedSpecification.join(' | ') }];
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
