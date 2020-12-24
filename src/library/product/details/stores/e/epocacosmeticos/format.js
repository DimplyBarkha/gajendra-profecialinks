/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      if (row.category) {
        row.category.shift();
      }
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.includes('InStock')) ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return clean(item.text);
        });
        row.description = [{ text: descriptionArr.join('||'), xpath: row.description[0].xpath }];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
        row.secondaryImageTotal = [{ text: row.alternateImages.length, xpath: row.alternateImages[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return clean(typeof (item.text) === 'string' ? item.text.replace(/www.youtube.com\/embed\/[\w\-/_]*/g, '').replace('Video', '').replace('https://', '').replace(/\n \n \n \n \n \n \n/g, '').replace(/\n \n \n \n/g, '').replace(/\n \n/g, ':').replace(/\n/g, ' ').replace('Concentração Concentração', 'Concentração').replace('Imagem Imagem', '').replace('Gênero Gênero', 'Gênero') : '');
        });
        row.specifications = [{ text: specificationsArr.join('||'), xpath: row.specifications[0].xpath }];
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return clean(typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ':').replace(/\n/g, ' ') : ' | ');
        });
        row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join(' | '), xpath: row.manufacturerDescription[0].xpath }];
      }
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        row.descriptionBullets = [{ text: row.additionalDescBulletInfo.length, xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.manufacturerImages) {
        const manufacturerImagesArr = row.manufacturerImages.map((item) => {
          return item.text;
        });
        row.manufacturerImages = [{ text: manufacturerImagesArr.join(' | '), xpath: row.manufacturerImages[0].xpath }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
