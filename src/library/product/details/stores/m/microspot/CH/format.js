
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications && row.spec1) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += row.specifications[i].text + ' : ' + row.spec1[i].text + ' | ';
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.description) {
        let descriptionOne = '';
        if (row.descriptionOne) {
          let text = '';
          let count = 0;
          row.descriptionOne.forEach(item => {
            if (count % 2 === 0) {
              text += `|| ${item.text} : `;
            } else {
              text += `${item.text}`;
            }
            count++;
          });
          descriptionOne = text;
        }
        let desc = '';
        row.description.forEach(item => {
          desc += item.text.replace(/•/g, '||');
        });

        if (row.additionalDescBulletInfo) {
          row.descriptionBullets = [
            {
              text: row.additionalDescBulletInfo.length,
            },
          ];
        }

        if (row.inTheBoxText) {
          let text, arrInTheBox = [];
          row.inTheBoxText.forEach(item => {
              arrInTheBox.push(item.text);
          });
          let arrUniqueText =  [...new Set(arrInTheBox)];
          row.inTheBoxText = [ 
            { text: arrUniqueText.toString().replace(/,/g, '||').replace(/und\b/g, '||') }
          ]
        }

        if (descriptionOne) {
          desc = `${descriptionOne} | ${desc}`;
        }
        row.description = [
          {
            text: clean(desc),
          },
        ];
      }
      if (row.variantCount && row.variantCount[0].text !== '0' && row.variantInformation) {
        row.variantInformation = [{ text: row.variantInformation[0].text }];
      }
    }
  }

  return data;
};

module.exports = { transform };
