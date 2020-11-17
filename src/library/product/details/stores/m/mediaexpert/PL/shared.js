
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        for (let i = 0; i < row.category.length; i++) {
          row.category[i].text = row.category[i].text.replace('›', '');
        }
      }

      if (row.alternateImages) {
        for (let i = 0; i < row.alternateImages.length; i++) {
          const imageObj = row.alternateImages[i].text;
          const image = imageObj.substring(imageObj.indexOf('media'), imageObj.indexOf("',"));
          const imageStr = `https://www.mediaexpert.pl/${image}`;
          row.alternateImages[i].text = imageStr;
        }
      }

      if (row.productData) {
        let prodData = JSON.parse(row.productData[0].text)['@graph'];
        if (prodData) {
          prodData = prodData[0];
          if (prodData) {
            row.aggregateRating = prodData.aggregateRating && prodData.aggregateRating.ratingValue ? [{ text: prodData.aggregateRating.ratingValue }] : [];
            prodData.sku ? row.variantId = [{ text: prodData.sku }] : row.variantId = [];
            prodData.gtin13 ? row.eangtin = [{ text: prodData.gtin13 }] : row.eangtin = [];
          }
        }
      }

      if (row.videos) {
        for (let i = 0; i < row.videos.length; i++) {
          let videoStr = row.videos[i].text;
          videoStr = videoStr.substring(0, videoStr.indexOf('?'));
          videoStr = `https://www.youtube.com/watch?v=${videoStr}`;
          row.videos[i].text = videoStr;
        }
      }

      if (row.aggregateRating && row.aggregateRating.length > 0) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
      }

      if (row.price) {
        row.price[0].text = row.price[0].text.replace('.', ',');
      }

      if (row.listPrice) {
        row.listPrice[0].text = row.listPrice[0].text.replace('.', ',');
      }

      if (row.specifications) {
        let specStr = '';
        for (let i = 0; i < row.specifications.length; i++) {
          specStr += `${row.specifications[i].text} || `;
        }
        specStr = specStr.substring(0, specStr.lastIndexOf('|| '));
        row.specifications = [{ text: specStr }];
      }

      if (row.weightNet) {
        let netWeight = row.weightNet[0].text;
        if (netWeight.includes('/')) {
          netWeight = netWeight.split('/')[1];
        }
        row.weightNet = [{ text: netWeight }];
      }

      if (row.image) {
        let imageData = row.image[0].text;
        imageData = imageData.substring(imageData.indexOf("'/media") + 1, imageData.indexOf("',"));
        row.image = [{ text: `https://www.mediaexpert.pl${imageData}` }];
      }

      if (!row.image && row.productSingleImage) {
        row.image = row.productSingleImage;
        let imageData = row.image[0].text;
        imageData = imageData.substring(imageData.indexOf("'/media") + 1, imageData.indexOf("',"));
        row.image = [{ text: `https://www.mediaexpert.pl${imageData}` }];
        row.imageAlt = row.productSingleImageAltText ? row.productSingleImageAltText : [];
        if (row.alternateImages) {
          delete row.alternateImages;
          delete row.secondaryImageTotal;
        }
      }

      if (row.manufacturerDescription) {
        let enhancedContent = '';
        for (let i = 0; i < row.manufacturerDescription.length; i++) {
          enhancedContent += row.manufacturerDescription[i].text + ' ';
        }
        row.manufacturerDescription = [{ text: enhancedContent }];
      }

      if (row.weightNet) {
        let weightNet = row.weightNet[0].text;
        if (row.weightNetUom) {
          weightNet = `${weightNet} ${row.weightNetUom[0].text}`;
        } else {
          weightNet = `${weightNet} kg`;
        }
        row.weightNet = [{ text: weightNet }];
      }

      if (row.enhancedContent && !row.manufacturerDescription) {
        row.manufacturerDescription = row.enhancedContent;
      }

      if (!row.sku) {
        row.sku = row.skuSecondary;
        if (!row.sku && row.skuAtLast) {
          row.sku = row.skuAtLast;
        }
      }

      if (!row.manufacturerImages && row.aplusImages_fallBack) {
        row.manufacturerImages = row.aplusImages_fallBack;
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(function (header) {
    if (row[header]) {
      row[header].forEach(el => {
        el.text = clean(el.text);
      });
    }
  })));

  return data;
};

module.exports = { transform };
