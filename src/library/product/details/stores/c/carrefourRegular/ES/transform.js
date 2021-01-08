
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/\/hd_[\d]+x_/g, '');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/\/hd_[\d]+x_/g, '');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.*\/(.*?)\/p/g, '$1');
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim();
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.split(' ') ? item.text.split(' ')[0] : '';
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          const videoJSON = JSON.parse(item.text.replace(/\\"/gm, '"'));
          if (videoJSON) {
            item.text = (videoJSON.playlist && videoJSON.playlist[0] && videoJSON.playlist[0].file) ? 'https:' + videoJSON.playlist[0].file : '';
          }
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ').replace(/●/g, '||');
        });
        row.description = [{ text }];
      }
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(item => {
          text += item.text + ' ';
        });
        text = text.trim();
        row.shippingInfo = [{ text }];
      }
      // if (row.availabilityText) {
      //   let newText = 'Out Of Stock';
      //   row.availabilityText.forEach(item => {
      //     if (item.text.trim() === 'Añadir') {
      //       newText = 'In Stock';
      //     }
      //   });
      //   row.availabilityText = [{ text: newText }];
      // }
      if (row.lbb) {
        row.lbb.forEach(item => {
          if (item.text.includes('Carrefour')) {
            item.text = 'No';
          } else {
            item.text = 'Yes';
          }
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(item => {
          if (row.lbb && row.lbb[0].text === 'No') {
            item.text = '';
          }
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += item.text.trim() + ' : ';
          } else {
            text += item.text.trim() + ' || ';
          }
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      // if (row.inTheBoxUrl) {

      //   row.inTheBoxUrl.forEach(image => {
      //     console.log("image.text",image.text);
      //     let count = 10;
      //     const allImages = image.text.split(', ').map(img => img.trim());
      //     let mainImage;
      //     mainImage = allImages[0].replace(/(.*?)\s.*/, '$1').trim();
      //     image.text = mainImage;
      //     console.log("image.text",image.text)
      //     console.log("here i am ", count);
      //   });
      // }


      // if(row.inTheBoxUrl){
      //   console.log("inTheBoxUrl",row.inTheBoxUrl);
      //   let imageArray = [];
      //   if(row.inTheBoxUrl.length > 0){
      //     for(let i = 0; i < row.inTheBoxUrl.length; i++){
      //       let text = row.inTheBoxUrl[i].text;
      //       let splits = text.split(",");
      //       imageArray.push(`${splits[0]}`);
      //     }
      //     // let oneLess = imageArray;
      //     let joins =  imageArray.join(" || ");
      //     row.inTheBoxUrl = [{text: joins}]
      //   }
      // }

      if (row.UPDP) {
        let arr = [];
        row.UPDP.forEach(item => {
          arr.push(item.text);
        })
        row.UPDP = arr.join('||');
      }



      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach((item, index) => {
          if (index % 2 === 0) {
            text += item.text.trim() + ' : ';
          } else {
            text += item.text.trim() + ' || ';
          }
        });
        row.productOtherInformation = [
          {
            text: text.slice(0, -4),
          },
        ];
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


