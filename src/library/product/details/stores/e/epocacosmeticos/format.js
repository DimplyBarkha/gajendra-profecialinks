/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, '') : '|';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/www.youtube.com\/embed\/[\w\-/_]*/g, '').replace('Video', '').replace('https://', '').replace(/\n \n \n \n \n \n \n/g, '|').replace(/\n \n \n \n/g, '|').replace(/\n \n/g, ':').replace(/\n/g, ' ').replace('Concentração Concentração', 'Concentração').replace('Imagem Imagem', '').replace('Gênero Gênero', 'Gênero') : '|';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, '|').replace(/\n \n/g, ':').replace(/\n/g, ' ') : '|';
        });
        row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join('|'), xpath: row.manufacturerDescription[0].xpath }];
      }
      if (row.manufacturerImages) {
        const manufacturerImagesArr = row.manufacturerImages.map((item) => {
          return item.text;
        });
        row.manufacturerImages = [{ text: manufacturerImagesArr.join(' | '), xpath: row.manufacturerImages[0].xpath }];
      }
      if (row.descriptionBullets) {
        row.descriptionBullets = [{ text: row.descriptionBullets.length, xpath: row.descriptionBullets[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
