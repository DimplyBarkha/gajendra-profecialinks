/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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

    for (const { group } of data) {
        for (const row of group) {
            if (row.specifications) {
                const text = row.specifications.map(elm => elm.text.replace('-', '').replace('"', '').trim()).join(' || ');
                row.specifications = [{ text }];
            }
            if (row.metaKeywords) {
                let text = '';
                row.metaKeywords.forEach(item => {
                    text += item.text.replace(/\\n/g, '').trim();
                });
                row.metaKeywords = [
                    {
                        text: text,
                    },
                ];
            }
            // if (row.description) {
            //     row.description.forEach((element) => {
            //         if (element.xpath.endsWith('ul[1]')) {
            //             element.text = element.text.replace(/(\.|)\s{1,}/g, '. || ');
            //         }
            //     })
            //     let text = ''
            //     row.description.forEach((element) => {
            //         if (element.xpath.endsWith('ul[1]')) {
            //             text += ` || ${element.text}`
            //         } else {
            //             text += ` ${element.text}`
            //         }
            //     })
            //     row.description = [{ text: text.trim() }]
            // }
            if(row.secondparagraph) {
                let text = row.secondparagraph.map((element)=> element.text.trim()).join(" ")
                row.secondparagraph = [{text}]
            }
            if(row.description) {
                let text = row.description.map((element)=> element.text.trim()).join(" ")
                row.description = [{text}]
            }
            if (row.manufacturerDescription) {
                let text1 = ''
                row.manufacturerDescription.forEach((element) => {
                    text1 += `${element.text} `;
                })
                row.manufacturerDescription = [{ text: text1.trim() }]
            }
            if (row.additionalDescBulletInfo) {
                let bulletString = '';
                row.additionalDescBulletInfo.forEach((element) => {
                    bulletString += `|| ${element.text}`;
                })
                row.additionalDescBulletInfo = [{ text: bulletString }];
            }
            if(row.description && row.secondparagraph && row.additionalDescBulletInfo){
                let text = `${row.description[0].text} ${row.additionalDescBulletInfo[0].text} ${row.secondparagraph[0].text}`
                row.description = [{text: text.trim()}];
            }

        }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
};

module.exports = { cleanUp };