/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data, context) => {
	const clean = (text) =>
		text
			.toString()
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
	data.forEach((obj) =>
		obj.group.forEach((row) =>
			Object.keys(row).forEach((header) =>
				row[header].forEach((el) => {
					el.text = clean(el.text);
					el.text = el.text.trim();
				})
			)
		)
	);
	for (const { group } of data) {
		for (const row of group) {
			// if (row.alternateImages) {
			//   let data = [];
			//   let images = [];
			//   row.alternateImages.forEach(item => {
			//     data = item.text.split('= ');
			//     item.text = data[1].replace('window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ', '').slice(0, -1) ;
			//     const data1 = JSON.parse(String(item.text));
			//     if (data1.product.images) {
			//       item.text = String(data1.product.images);
			//       item.text = String(item.text).replace(/^[^,]+, */, '');
			//        images = String(item.text).split(',');
			//     } else {
			//        images[0] = '';
			//     }
			//     row.alternateImages = [{'text': images.join(' | '),'xpath':row.alternateImages[0].xpath}];
			//   });
			// }

			if (row.additionalDescBulletInfo) {
				let text = '';
				row.additionalDescBulletInfo.forEach((item) => {
					text += `${item.text} || `;
				});
				row.additionalDescBulletInfo = [
					{
						text: text,
					},
				];
			}

			// if (row.description) {
			//   row.description.forEach(item => {
			//     let descText=item.text.replace('window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ', '').slice(0, -1) ;
			//     let data = JSON.parse(descText);
			//     if(data.product.metaBrand.hasOwnProperty('name')){
			//        if(data.product.metaBrand.hasOwnProperty('name') && data.product.hasOwnProperty('name') ){
			//         item.text = String(data.product.metaBrand.name) + ' ' + String(data.product.name);
			//        }else  if( data.product.hasOwnProperty('name') ){
			//         item.text =  String(data.product.name);
			//        }else{
			//         item.text = "";
			//        }
			//     }else{
			//         item.text = "";
			//     }
			//   });
			// }

			// if (row.aggregateRating) {
			//   row.aggregateRating.forEach(item => {
			//     let avgRating=item.text.replace('window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ', '').slice(0, -1) ;
			//     let data = JSON.parse(avgRating);
			//     if(data.product.hasOwnProperty('ratingScore')){
			//        if(data.product.ratingScore.hasOwnProperty('averageRating')){
			//         item.text = String(data.product.ratingScore.averageRating);
			//         item.text = String(item.text).replace(/\s*/g, '');
			//         item.text = String(item.text).replace('.',',')
			//        }else{
			//         item.text = "0";
			//        }
			//     }else{
			//       item.text = "0";
			//     }
			//   });
			// }

			// if (row.sku) {
			//   row.sku.forEach(item => {
			//     let skuVal=item.text.replace('window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ', '').slice(0, -1) ;
			//     let data = JSON.parse(skuVal);
			//     if(data.product.hasOwnProperty('variants')){
			//       if(data.product.variants[0]){
			//         item.text=data.product.variants[0].barcode;
			//       }else{
			//         if(data.product.hasOwnProperty('productCode')){
			//           item.text=data.product.productCode;
			//         }
			//       }

			//     }else if(data.product.hasOwnProperty('productCode')){
			//       item.text=data.product.productCode;
			//     }else{
			//       item.text="";
			//     }
			//     /*if(data.hasOwnProperty('gtin13')){
			//       item.text=data.gtin13;
			//     }else{
			//       item.text="";
			//     }*/
			//   });
			// }
			// if (row.gtin) {
			//   row.gtin.forEach(item => {
			//     let data = JSON.parse(item.text);
			//     if(data['gtin13']){
			//       if(data['gtin13']){
			//         item.text = data['gtin13'];
			//       }
			//     }else{
			//       item.text = "";
			//     }
			//   });
			// }

			if (row.manufacturerImages) {
				row.manufacturerImages.forEach((item) => {
					item.text = String(item.text).replace('{cdn_url}', '');
					item.text = 'https://cdn.dsmcdn.com' + item.text;
				});
			}
			if (row.aggregateRating) {
				row.aggregateRating[0].text = Number(row.aggregateRating[0].text)
					.toFixed(1)
					.replace('.', ',');
			}
		}
	}

	return data;
};

module.exports = { transform };
