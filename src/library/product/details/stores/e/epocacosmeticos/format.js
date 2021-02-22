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
        // const availabilityTextArr = row.availabilityText.map((item) => {
        //   return (typeof (item.text) === 'string') && (item.text.includes('Comprar')) ? 'In Stock' : 'Out of Stock';
        // });
        // row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
        row.availabilityText[0].text = row.availabilityText[0].text.toLocaleLowerCase().includes('comprar') ? 'In Stock' : 'Out Of Stock';
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return clean(typeof (item.text) === 'string' ? item.text.replace(/www.youtube.com\/embed\/[\w\-/_]*/g, '').replace('Video', '').replace('https://', '').replace(/\n \n \n \n \n \n \n/g, '').replace(/\n \n \n \n/g, '').replace(/\n \n/g, ':').replace(/\n/g, ' ').replace('Concentração Concentração', 'Concentração').replace('Imagem Imagem', '').replace('Gênero Gênero', 'Gênero') : '');
        });
        row.specifications = [{ text: specificationsArr.join('||'), xpath: row.specifications[0].xpath }];
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return clean(typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n \n \n/g, ' ').replace(/\n \n \n \n/g, ' ').replace(/\n \n/g, ':').replace(/\n/g, ' ') : ' ');
        });
        row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join(' '), xpath: row.manufacturerDescription[0].xpath }];
      }
      // if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
      //   row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
      //   row.descriptionBullets = [{ text: row.additionalDescBulletInfo.length, xpath: row.additionalDescBulletInfo[0].xpath }];
      // }
      if (row.manufacturerImages) {
        const manufacturerImagesArr = row.manufacturerImages.map((item) => {
          return clean(item.text);
        });
        row.manufacturerImages = [{ text: manufacturerImagesArr.join(' | '), xpath: row.manufacturerImages[0].xpath }];
      }
      if (row.brandText) {
        row.brandText = [{ text: row.brandText[0].text.replace(/'/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, ''), xpath: row.brandText[0].xpath }];
      }
      if (row.nameExtended) {
        const nameExtendedArr = row.nameExtended.map((item) => {
          return clean(item.text);
        });
        row.nameExtended = [{ text: nameExtendedArr.join(' '), xpath: row.nameExtended[0].xpath }];
      }
      if (row.name) {
        const nameArr = row.name.map((item) => {
          return clean(item.text);
        });
        row.name = [{ text: nameArr.join(' '), xpath: row.name[0].xpath }];
      }
      if (row.warranty) {
        const warrantyArr = row.warranty.map((item) => {
          return clean(item.text);
        });
        row.warranty = [{ text: warrantyArr.join(' '), xpath: row.warranty[0].xpath }];
      }
      if (row.description) {
        const newDescription = row.description.map((item) => {
          const searchItemIndex = item.text.search(/Modo de Usar/i);
          if (searchItemIndex > -1) {
            return clean(item.text.substring(0, searchItemIndex));
          } else {
            return clean(item.text);
          }
        });
        row.descriptionBullets = [{ text: (newDescription[0].match(/•/g) || []).length, xpath: row.description[0].xpath }];
        row.description = [{ text: newDescription[0].trim().replace(/•/g, '||').replace(/There is a trailing space here/g, '').replace(/[\\[\]']+/g, '') }];
      }
      if (row.directions) {
        const newDirections = row.directions.map((item) => {
          const searchItemIndex = item.text.search(/Modo de Usar/i);
          if (searchItemIndex > -1) {
            var text = '';
            text = clean(item.text.substring(searchItemIndex + 13, item.text.length));
            return text.trim().replace(/There is a trailing space here/g, '').replace(/[\\[\]']+/g, '');
          }
        });
        row.directions = [{ text: newDirections && newDirections[0] }];
      }
      if (row.aggregateRating) {
        const aggregateRatingArr = row.aggregateRating.map((item) => {
          return clean(item.text.replace('.', ','));
        });
        row.aggregateRating = [{ text: aggregateRatingArr[0], xpath: row.aggregateRating[0].xpath }];
        row.aggregateRating2 = [{ text: aggregateRatingArr[0], xpath: row.aggregateRating[0].xpath }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        // el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
