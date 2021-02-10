/* eslint-disable no-redeclare */
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    transform: transform,
    domain: 'auchan.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    const { transform } = parameters;
    await context.evaluate(async function () {
      const delay = t => new Promise(resolve => setTimeout(resolve, t));

      const locationContent = document.createElement('div');
      locationContent.setAttribute('class', 'location-content');
      locationContent.setAttribute('style', 'display: none');
      locationContent.innerHTML = `<link rel="stylesheet" href="/delivery-renderer/sav_20201103-01/css/delivery-prices-styles.min.css" data-pipe-name="Pipe" data-original-href="/delivery-renderer/sav_20201103-01/css/delivery-prices-styles.min.css"><script>Pipe.registerCSS("/delivery-renderer/sav_20201103-01/css/delivery-prices-styles.min.css")</script><link rel="stylesheet" href="/journey-renderer/sav_20201210-00/css/journey-offering-contexts-styles.min.css" data-pipe-name="Pipe" data-original-href="/journey-renderer/sav_20201210-00/css/journey-offering-contexts-styles.min.css"><script>Pipe.registerCSS("/journey-renderer/sav_20201210-00/css/journey-offering-contexts-styles.min.css")</script><link rel="stylesheet" href="/place-renderer/sav_20201218-00/css/point-of-service-styles.min.css" data-pipe-name="Pipe" data-original-href="/place-renderer/sav_20201218-00/css/point-of-service-styles.min.css"><script>Pipe.registerCSS("/place-renderer/sav_20201218-00/css/point-of-service-styles.min.css")</script><script data-index="0" data-type="start" data-pipe="">Pipe.start(0)</script><section class="journey__offering-contexts"><div class="journey-offering-contexts__wrapper "><div class="journey__offering-contexts-title bolder">10 résultats</div><div class="journey-offering-context__wrapper shadow--light"><div class="journey-offering-context__main-infos-wrapper"><i class="journey-offering-context__type-logo icon-shipping" aria-hidden="true"></i><div class="journey-offering-context__main-infos"><span class="journey-offering-context__type-name">Livraison à domicile</span><span class="journey-offering-context__name">Paris</span><div class="journey-offering-context__slot"><script data-index="5" data-type="start" data-pipe>Pipe.start(5)</script>
              dès Friday 12 February 07:00 - 09:00
  <script data-index="5" data-type="end" data-pipe>Pipe.end(5)</script></div></div><div class="journey-offering-context__actions"><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_e91e6681-8021-45c4-8e27-d8be64f24d50"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="zipcode" value="75020"><input type="hidden" name="city" value="Paris"><input type="hidden" name="country" value="France"><input type="hidden" name="latitude" value="48.8599825"><input type="hidden" name="longitude" value="2.4066412"><input type="hidden" name="accuracy" value="MUNICIPALITY"><input type="hidden" name="sellerId" value="e91e6681-8021-45c4-8e27-d8be64f24d50"><input type="hidden" name="channels" value="SHIPPING"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Livraison à domicile à Paris">Choisir</button></form></div></div><section class="journey-offering-contexts__details"><button class="journey-offering-contexts__details-expander" aria-expanded="false" type="button"><div class="journey-offering-contexts__details-expander-label">Infos et Tarifs</div><i class="journey-offering-contexts__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="journey-offering-contexts__details-content"><script data-index="10" data-type="start" data-pipe>Pipe.start(10)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      <span class="deliveryPrices__line">Frais de livraison dégressifs*</span>
  
      <span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">Minimum de commande</span>
          <span class="deliveryPrices__line-end bolder">50,00€</span>
      </span>
      
  
  
      <span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">0,00€-50,00€</span>
          
          <span class="deliveryPrices__line-end bolder">20,00€</span>
          
      </span><span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">50,00€-150,00€</span>
          
          <span class="deliveryPrices__line-end bolder">9,90€</span>
          
      </span><span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">150,00€-180,00€</span>
          
          <span class="deliveryPrices__line-end bolder">5,00€</span>
          
      </span><span class="deliveryPrices__line">
          
          <span class="deliveryPrices__line-start">&gt;180,00€</span>
          
          <span class="deliveryPrices__line-end deliveryPrices__line-end--red bolder">GRATUIT</span>
      </span>
  
      
  </div><script data-index="10" data-type="end" data-pipe>Pipe.end(10)</script></main></section></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.86558" data-lng="2.41509" data-type="PICKUP_POINT" data-id="aa9d1767-21b9-48b5-8ff2-4839f9a07710" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="15" data-type="start" data-pipe="">Pipe.start(15)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">Bagnolet</span><div class="place-pos__address"><span>93170 Bagnolet</span></div><div class="place-pos__slot"><script data-index="180" data-type="start" data-pipe>Pipe.start(180)</script>
      
      
          
              dès Thursday 11 February 10:00 - 12:00
              
          
      
  <script data-index="180" data-type="end" data-pipe>Pipe.end(180)</script></div></div></div></div><script data-index="15" data-type="end" data-pipe="">Pipe.end(15)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">875.42 m</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_f413a404-e96f-42e4-92cc-21fb81010e99"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="f413a404-e96f-42e4-92cc-21fb81010e99"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="5401"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à Bagnolet">Choisir</button></form></div></div><script data-index="20" data-type="start" data-pipe="">Pipe.start(20, "/place-renderer/sav_20201218-00/js/point-of-service-scripts.min.js", {"id":20,"range":[20,20]})</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_f413a404-e96f-42e4-92cc-21fb81010e99"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_aa9d1767-21b9-48b5-8ff2-4839f9a07710" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 12:30
                              
                          
                      
                      
                  
               </span></div><script data-index="110" data-type="start" data-pipe>Pipe.start(110)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      <span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">Minimum de commande</span>
          <span class="deliveryPrices__line-end bolder">20,00€</span>
      </span>
      
  
  
      
  
      <span class="deliveryPrices__line">
          <span class="deliveryPrices__line-start">Frais de préparation (dont ensachage)</span>
          <span class="deliveryPrices__line-end bolder">0,20€</span>
      </span>
  </div><script data-index="110" data-type="end" data-pipe>Pipe.end(110)</script></main></section><script data-index="20" data-type="end" data-pipe="">Pipe.end(20, "/place-renderer/sav_20201218-00/js/point-of-service-scripts.min.js", {"id":20,"range":[20,20]})</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.870787" data-lng="2.398705" data-type="LOCKERS" data-id="992b623b-d08e-4245-99e9-b89f7a5871e6" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="25" data-type="start" data-pipe="">Pipe.start(25)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-lockers" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Consigne</span><span class="place-pos__name">My Auchan Ménilmontant</span><div class="place-pos__address"><span>75020 Paris</span></div><div class="place-pos__slot"><script data-index="170" data-type="start" data-pipe>Pipe.start(170)</script>
      
      
          
              dès Thursday 11 February 15:00 - 18:00
              
          
      
  <script data-index="170" data-type="end" data-pipe>Pipe.end(170)</script></div></div></div></div><script data-index="25" data-type="end" data-pipe="">Pipe.end(25)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">1.33 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_0b52aca9-04a4-421b-8472-8966076235ac"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="0b52aca9-04a4-421b-8472-8966076235ac"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646003"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Ménilmontant">Choisir</button></form></div></div><script data-index="30" data-type="start" data-pipe="">Pipe.start(30)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_0b52aca9-04a4-421b-8472-8966076235ac"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Mardi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Mercredi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Jeudi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Vendredi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Samedi_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Dimanche_992b623b-d08e-4245-99e9-b89f7a5871e6" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><script data-index="115" data-type="start" data-pipe>Pipe.start(115)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="115" data-type="end" data-pipe>Pipe.end(115)</script></main></section><script data-index="30" data-type="end" data-pipe="">Pipe.end(30)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.8696821" data-lng="2.3895" data-type="PICKUP_POINT" data-id="539e0991-783f-4059-aca1-7cc77689c396" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="35" data-type="start" data-pipe="">Pipe.start(35)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Chevreau</span><div class="place-pos__address"><span>75020 Paris</span></div><div class="place-pos__slot"><script data-index="155" data-type="start" data-pipe>Pipe.start(155)</script>
      
      
          
              dès Thursday 11 February 15:15 - 18:00
              
          
      
  <script data-index="155" data-type="end" data-pipe>Pipe.end(155)</script></div></div></div></div><script data-index="35" data-type="end" data-pipe="">Pipe.end(35)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">1.66 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_47400ff0-21be-451b-90e9-238f6ed92a76"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="47400ff0-21be-451b-90e9-238f6ed92a76"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646005"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Chevreau">Choisir</button></form></div></div><script data-index="40" data-type="start" data-pipe="">Pipe.start(40)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_47400ff0-21be-451b-90e9-238f6ed92a76"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Mardi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Mercredi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Jeudi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Vendredi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Samedi_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><div for="Dimanche_539e0991-783f-4059-aca1-7cc77689c396" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end"><span class="bolder red-txt">Fermé</span></span></div><script data-index="120" data-type="start" data-pipe>Pipe.start(120)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="120" data-type="end" data-pipe>Pipe.end(120)</script></main></section><script data-index="40" data-type="end" data-pipe="">Pipe.end(40)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.874101" data-lng="2.39336" data-type="PICKUP_POINT" data-id="e2290aa6-a044-4845-a931-1a3f593931e2" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="45" data-type="start" data-pipe="">Pipe.start(45)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Metra</span><div class="place-pos__address"><span>75020 Paris</span></div><div class="place-pos__slot"><script data-index="160" data-type="start" data-pipe>Pipe.start(160)</script>
      
      
          
              dès Thursday 11 February 15:30 - 18:00
              
          
      
  <script data-index="160" data-type="end" data-pipe>Pipe.end(160)</script></div></div></div></div><script data-index="45" data-type="end" data-pipe="">Pipe.end(45)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">1.85 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_df5fca0e-098b-4309-952e-68453733c0a1"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="df5fca0e-098b-4309-952e-68453733c0a1"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646013"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Metra">Choisir</button></form></div></div><script data-index="50" data-type="start" data-pipe="">Pipe.start(50)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_df5fca0e-098b-4309-952e-68453733c0a1"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_e2290aa6-a044-4845-a931-1a3f593931e2" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="125" data-type="start" data-pipe>Pipe.start(125)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="125" data-type="end" data-pipe>Pipe.end(125)</script></main></section><script data-index="50" data-type="end" data-pipe="">Pipe.end(50)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.833558" data-lng="2.399741" data-type="PICKUP_POINT" data-id="70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="55" data-type="start" data-pipe="">Pipe.start(55)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Bizot </span><div class="place-pos__address"><span>75012 Paris</span></div><div class="place-pos__slot"><script data-index="175" data-type="start" data-pipe>Pipe.start(175)</script>
      
      
          
              dès Thursday 11 February 14:45 - 18:00
              
          
      
  <script data-index="175" data-type="end" data-pipe>Pipe.end(175)</script></div></div></div></div><script data-index="55" data-type="end" data-pipe="">Pipe.end(55)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">2.99 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_d33036bf-9564-4d63-800f-598dbce793d4"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="d33036bf-9564-4d63-800f-598dbce793d4"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646022"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan BIZOT ">Choisir</button></form></div></div><script data-index="60" data-type="start" data-pipe="">Pipe.start(60)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_d33036bf-9564-4d63-800f-598dbce793d4"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:00 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_70b40dca-9064-4b9a-a6d2-058fc1dc5f7f" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="130" data-type="start" data-pipe>Pipe.start(130)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="130" data-type="end" data-pipe>Pipe.end(130)</script></main></section><script data-index="60" data-type="end" data-pipe="">Pipe.end(60)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.8883711" data-lng="2.3741078" data-type="PICKUP_POINT" data-id="6a6d78a5-f860-430e-9300-8284adc168a4"><div class="journey-offering-context__main-infos-wrapper"><script data-index="65" data-type="start" data-pipe="">Pipe.start(65)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Paris Riquet</span><div class="place-pos__address"><span>75019 Paris</span></div><div class="place-pos__slot"><script data-index="185" data-type="start" data-pipe>Pipe.start(185)</script>
      
      
          
              
              Pas de créneau disponible
          
      
  <script data-index="185" data-type="end" data-pipe>Pipe.end(185)</script></div></div></div></div><script data-index="65" data-type="end" data-pipe="">Pipe.end(65)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">3.96 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_0e171501-60c2-4584-9807-f2b6c5c9a0ad"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="0e171501-60c2-4584-9807-f2b6c5c9a0ad"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646019"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Paris Riquet">Choisir</button></form></div></div><script data-index="70" data-type="start" data-pipe="">Pipe.start(70)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_0e171501-60c2-4584-9807-f2b6c5c9a0ad"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:00 - 22:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_6a6d78a5-f860-430e-9300-8284adc168a4" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="135" data-type="start" data-pipe>Pipe.start(135)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="135" data-type="end" data-pipe>Pipe.end(135)</script></main></section><script data-index="70" data-type="end" data-pipe="">Pipe.end(70)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.8301" data-lng="2.37553" data-type="PICKUP_POINT" data-id="100a6c8c-2344-4241-a5d6-bedc6cea8208" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="75" data-type="start" data-pipe="">Pipe.start(75)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Paris Chevaleret</span><div class="place-pos__address"><span>75013 Paris</span></div><div class="place-pos__slot"><script data-index="165" data-type="start" data-pipe>Pipe.start(165)</script>
      
      
          
              dès Thursday 11 February 14:30 - 18:00
              
          
      
  <script data-index="165" data-type="end" data-pipe>Pipe.end(165)</script></div></div></div></div><script data-index="75" data-type="end" data-pipe="">Pipe.end(75)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">4.04 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_6f18662a-c662-4a81-bb3a-95419a20888a"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="6f18662a-c662-4a81-bb3a-95419a20888a"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646016"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Paris Chevaleret">Choisir</button></form></div></div><script data-index="80" data-type="start" data-pipe="">Pipe.start(80)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_6f18662a-c662-4a81-bb3a-95419a20888a"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_100a6c8c-2344-4241-a5d6-bedc6cea8208" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="140" data-type="start" data-pipe>Pipe.start(140)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="140" data-type="end" data-pipe>Pipe.end(140)</script></main></section><script data-index="80" data-type="end" data-pipe="">Pipe.end(80)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.866994" data-lng="2.347874" data-type="PICKUP_POINT" data-id="ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" data-restricted="false"><div class="journey-offering-context__main-infos-wrapper"><script data-index="85" data-type="start" data-pipe="">Pipe.start(85)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Réaumur</span><div class="place-pos__address"><span>75002 Paris</span></div><div class="place-pos__slot"><script data-index="195" data-type="start" data-pipe>Pipe.start(195)</script>
      
      
          
              dès Thursday 11 February 16:00 - 18:00
              
          
      
  <script data-index="195" data-type="end" data-pipe>Pipe.end(195)</script></div></div></div></div><script data-index="85" data-type="end" data-pipe="">Pipe.end(85)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">4.38 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_4ea26910-3b73-4c8c-ab94-ed263fcc8aca"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="4ea26910-3b73-4c8c-ab94-ed263fcc8aca"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646008"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Réaumur">Choisir</button></form></div></div><script data-index="90" data-type="start" data-pipe="">Pipe.start(90)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_4ea26910-3b73-4c8c-ab94-ed263fcc8aca"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       07:30 - 20:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_ca55b7ab-e7d1-4a93-8149-55c634e5ca9d" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="145" data-type="start" data-pipe>Pipe.start(145)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="145" data-type="end" data-pipe>Pipe.end(145)</script></main></section><script data-index="90" data-type="end" data-pipe="">Pipe.end(90)</script></div><div class="journey-offering-context__wrapper journeyPosItem shadow--light" data-lat="48.894703" data-lng="2.374042" data-type="PICKUP_POINT" data-id="1a99ef6f-8731-460a-80fd-626aba143f6a"><div class="journey-offering-context__main-infos-wrapper"><script data-index="95" data-type="start" data-pipe="">Pipe.start(95)</script><div class="place-pos__wrapper"><div class="place-pos__wrapper place-pos__wrapper--row"><i class="place-pos__type-logo icon-pickup_point" aria-hidden="true"></i><div class="place-pos__main-infos"><span class="place-pos__type-name">Click & Collect</span><span class="place-pos__name">My Auchan Curial</span><div class="place-pos__address"><span>75019 Paris</span></div><div class="place-pos__slot"><script data-index="190" data-type="start" data-pipe>Pipe.start(190)</script>
      
      
          
              dès Thursday 11 February 15:45 - 18:00
              
          
      
  <script data-index="190" data-type="end" data-pipe>Pipe.end(190)</script></div></div></div></div><script data-index="95" data-type="end" data-pipe="">Pipe.end(95)</script><div class="journey-offering-context__actions"><div class="journey-offering-context__pos-distance icon-direction">4.54 km</div><form action="" method="get" class="journey-offering-contexts__form journeyChoice" autotrack-event-category="navigation" autotrack-event-action="store_locator" autotrack-event-label="select_241cc768-10d8-4c43-a9b5-cf200ed72ab4"><input type="hidden" name="availableInLark" value="true"><input type="hidden" name="sellerId" value="241cc768-10d8-4c43-a9b5-cf200ed72ab4"><input type="hidden" name="channels" value="PICK_UP"><input type="hidden" name="storeReference" value="646010"><button type="submit" class="btn btn--small" aria-label="Choisir le mode d'achat : Retrait à My Auchan Curial">Choisir</button></form></div></div><script data-index="100" data-type="start" data-pipe="">Pipe.start(100)</script><section class="place-pos__details"><button class="place-pos__details-expander" aria-expanded="false" type="button" autotrack-event-category="navigation" autotrack-event-action="place" autotrack-event-label="details_241cc768-10d8-4c43-a9b5-cf200ed72ab4"><div class="place-pos__details-expander-label">Infos et Tarifs</div><i class="place-pos__details-expander-icon icon-arrowLeft" aria-hidden="true"></i></button><main class="place-pos__details-content"><div class="pos-details__line pos-details__line--big bolder">Horaires</div><div for="Lundi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Lundi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Mardi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Mardi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Mercredi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Mercredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Jeudi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Jeudi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Vendredi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Vendredi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Samedi_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Samedi</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       08:30 - 21:00
                              
                          
                      
                      
                  
               </span></div><div for="Dimanche_1a99ef6f-8731-460a-80fd-626aba143f6a" class="pos-details__line"><span class="pos-details__line-start">Dimanche</span><span class="bolder pos-details__line-end">
                  
                      
                          
                              
                                       09:00 - 12:45
                              
                          
                      
                      
                  
               </span></div><script data-index="150" data-type="start" data-pipe>Pipe.start(150)</script><div class="deliveryPrices">
      <span class="deliveryPrices__line deliveryPrices__line--big bolder">Tarifs</span>
  
      
  
      
      <span>Pas de minimum de commande</span>
  
  
      
  
      
  </div><script data-index="150" data-type="end" data-pipe>Pipe.end(150)</script></main></section><script data-index="100" data-type="end" data-pipe="">Pipe.end(100)</script></div></div></section><main class="journey-offering-contexts__details-content"><script data-index="105" data-type="start" data-pipe>Pipe.start(105)</script><script data-index="105" data-type="end" data-pipe>Pipe.end(105)</script></main><script data-index="0" data-type="end" data-pipe="">Pipe.end(0)</script>`;

      document.body.appendChild(locationContent);
      console.log('Waiting');
      await delay(500);
      console.log('Attempting click on the shop');
      document.querySelector('.location-content .journey-offering-context__wrapper.shadow--light button[type="submit"]').click();
      console.log('Attempting to click again');
      document.querySelector('.location-content .journey-offering-context__wrapper.shadow--light button[type="submit"]').click();
    });
    try {
      await context.waitForNavigation();
      await context.waitForXPath('//span[contains(@class,"context-header__pos") and contains(text(),"Paris")]');
    } catch (error) {
      console.log('Loaded selector not found');
    }

    async function addEnhancedContent () {
      const jsApi = document.querySelector('[src*="ws.cnetcontent.com"]') && document.querySelector('[src*="ws.cnetcontent.com"]').src;
      let jsApi2 = document.querySelector('#flix-minisite no-script, #flix-inpage > script') && document.querySelector('#flix-minisite no-script, #flix-inpage > script').getAttribute('src');
      if (jsApi) {
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
        const response = await fetch(jsApi);
        const text = await response.text();
        const text2 = clean(text);
        const array = text2.match(/"htmlBlocks"\s*:\s*(\[.+])\s*,\s*"sites"/)[1];
        const html = unescape(array.match(/ccs-inline-content","html":"(.+)"/)[1].replace(/\\n/g, '')).replace(/\\"/g, '"').replace(/\\'/g, "'");
        const div = document.createElement('div');
        div.id = 'enhanced-content';
        div.innerHTML = html;
        document.body.append(div);
      } else {
        const [sku, ean] = Array.from(document.querySelectorAll('.product-detail--reference > span')).map(elm => elm.innerText.trim().match(/[^\s]+$/));
        jsApi2 = `https://media.flixcar.com/delivery/js/inpage/219/fr/mpn/${sku}/ean/${ean}`;
        let response = await fetch(jsApi2);
        if (response.status !== 200) throw Error('Enhanced content API Failed');
        const js = await response.text();
        if (js.match(/flixJsCallbacks.pid\s*='([^']+)/)) {
          const id = js.match(/flixJsCallbacks.pid\s*='([^']+)/)[1];
          response = await fetch(`https://media.flixcar.com/delivery/inpage/show/219/fr/${id}/json`);
          const html = JSON.parse((await response.text()).match(/^\((.+)\)$/)[1]).html;
          const div = document.createElement('div');
          div.id = 'enhanced-content';
          div.innerHTML = html;
          document.body.append(div);
        }
      }
    }
    await context.evaluate(addEnhancedContent);
    async function scrollToRec (node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }
    await scrollToRec('div.flex-wrapper');
    await scrollToRec('div#tabDescription');
    await scrollToRec('footer');
    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });

    try {
      await scrollToRec('div#tabDescription');
      await context.waitForSelector('div#flix-inpage', { timeout: 45000 });
    } catch (e) {
      console.log('No loading manuf content');
    }
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        if (window.product) {
          addHiddenDiv('custom-product-info-availablityText', window.product.stock.stockLevelStatus.code);
          addHiddenDiv('custom-product-ean', window.product.ean);
          var weight = '';
          var node = document.evaluate("(//div[contains(@class,'product-aside--textBlock')]//ul[contains(@class, 'product-aside--list')]//li[contains(translate(string(), 'POIDS', 'poids'), 'poids')]//div//span)[position()=1]", document, null, XPathResult.ANY_TYPE);
          data = node.iterateNext();
          if (data) {
            weight = data.innerText;
          } else {
            var node = document.evaluate("//td[contains(translate(string(), 'POIDS', 'poids'), 'poids')]/following-sibling::td", document, null, XPathResult.ANY_TYPE);
            data = node.iterateNext();
            if (data) {
              weight = data.innerText;
            }
          }
          addHiddenDiv('custom-product-info-weight', weight);
          try {
            var description = '';
            console.log('nilesh');
            var dINode = document.evaluate("//main[contains(@class, 'product-aside--container')]//text()", document, null, XPathResult.ANY_TYPE);
            console.log('dINode', dINode);
            do {
              var descriptionData = dINode.iterateNext();

              if (descriptionData) {
                description += descriptionData.data + ' ';
              }
            } while (descriptionData);
            description = description.trim().split('\n')[0];
            addHiddenDiv('custom-product-description', description);
          } catch (err) {
            console.log('nilesh', err);
          }

          try {
            var enhancedContent = '';
            var dINode = document.evaluate("//div[contains(@class, 'flix-Text-block') and not(contains(@class, 'inpage_selector_specification'))]//div//text()", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();

              if (directionData) { enhancedContent += directionData.data + ' '; }
            } while (directionData);
            var dINode = document.evaluate("//div[contains(@class, 'flix-std-featureslist')]", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();
              console.log(directionData);
              if (directionData) { enhancedContent += directionData.innerText + ' '; }
            } while (directionData);

            var dINode = document.evaluate("//div[contains(@class, 'inpage_selector_InTheBox')]//div//text()", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();

              if (directionData) { enhancedContent += directionData.data + ' '; }
            } while (directionData);
            console.log('enhancedContent', enhancedContent);
            addHiddenDiv('custom-product-enhanced-content', enhancedContent);
          } catch (err) { }
        } else {
          try {
            const isNull = document.querySelector('div.product-unavailable__message') == null;
            addHiddenDiv('custom-product-info-availablityText', !isNull ? 'Out Of Stock' : 'In Stock');
          } catch (e1) { }
          try {
            var node = document.evaluate("(//div[@class ='product-description__feature-group-wrapper']//span//following-sibling::*)[last()]", document, null, XPathResult.ANY_TYPE);
            var data = node.iterateNext();
            if (data) {
              var arr = data.innerText.split('/');
              if (arr.length) {
                addHiddenDiv('custom-product-ean', arr[1]);
                addHiddenDiv('custom-product-id', 'Ref:' + arr[0]);
              }
            }
          } catch (err) { }
          try {
            var dINode = document.evaluate("(//h5[contains(@class, 'product-description__feature-title') and contains(text(),'Informations pratiques')]//following-sibling::*)", document, null, XPathResult.ANY_TYPE);
            var direction = '';
            do {
              var directionData = dINode.iterateNext();
              if (directionData) { direction += directionData.innerText + ' '; }
            } while (directionData);
            addHiddenDiv('custom-product-direction', direction);
          } catch (err) { }
          try {
            var dINode = document.evaluate("//div[contains(@class,'nutritional__table')]//div[contains(@class,'nutritional__column')]", document, null, XPathResult.ANY_TYPE);

            var nutriData = [];
            var topIndex = 0;
            do {
              var nutData = dINode.iterateNext();
              if (nutData) {
                const arr = nutData.getElementsByClassName('nutritional__cell');
                var index = 0;
                for (var item of arr) {
                  if (topIndex === 0) {
                    nutriData.push({ key: item.innerText, value: '' });
                  } else if (topIndex === 1) {
                    nutriData[index].value = item.innerText;
                    index++;
                  }
                }
              }
              topIndex++;
            } while (nutData);

            var filteredValue = nutriData.filter((item) => { return item.key === 'Valeurs Energétiques en Kj'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-caloriesPerServing', filteredValue[0].value);
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'Matières grasses (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalFatPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalFatPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'dont acides gras saturés (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-saturatedFatPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-saturatedFatPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'Glucides (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalCarbPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalCarbPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'Fibres alimentaires (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-dietaryFibrePerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-dietaryFibrePerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'dont sucres (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalSugarsPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalSugarsPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'Protéines (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-proteinPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-proteinPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === 'Sel (en g)'; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-saltPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-saltPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Vitamine A') > -1; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-vitaminAPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-vitaminAPerServingUom', 'µg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Vitamine C (en mg)') > -1; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-vitaminCPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-vitaminCPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Calcium (en mg)') > -1; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-calciumPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-calciumPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Fer (en mg)') > -1; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-ironPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-ironPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Magnésium (en mg)') > -1; });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-magnesiumPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-magnesiumPerServingUom', 'mg');
            }
          } catch (err) { }
          try {
            const btnImageZoom = document.querySelector('button.product-gallery__img-btn');
            console.log('btnImageZoom', btnImageZoom);
            if (btnImageZoom) {
              btnImageZoom.click();
              await new Promise((resolve, reject) => setTimeout(resolve, 2000));
              var nodeImage = document.evaluate("//div[contains(@class, 'product-zoom__item')]//img", document, null, XPathResult.ANY_TYPE);
              data = nodeImage.iterateNext();
              if (data) {
                addHiddenDiv('custom-product-main-image', data.src);
              }
            }
          } catch (err) { }
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    });
    async function addPDP () {
      const productId = window.location.pathname.match(/[^\-]+$/)[0];
      const response = await fetch('https://www.auchan.fr/cross-sell', {
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-output-versioning': 'true',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: `path=%2FElectromenager%2FClimatisation_chauffage%2FPurificateur_d_air%2FDYSON_Ventilateur_purifiant_BP01_PURE_COOL_ME&productList=${productId}&productPrice=349&productStockLevel=inStock&orderProductList=&orderQuantityList=&orderPriceList=&pageType=PRODUCT&sendTrackingRequest=true&blocks%5B0%5D.externalId=1200-1&blocks%5B0%5D.htmlContainerId=ZNQ5Z2UN2MY8Q2-1200-1&blocks%5B0%5D.htmlContentComponent=t2s_pdp_tpl_api_aussiachete&blocks%5B0%5D.thirdParty=TARGET2SELL&blocks%5B0%5D.analytics=&blocks%5B1%5D.externalId=1200-15&blocks%5B1%5D.htmlContainerId=ZNQ5Z2UN2MY8Q2-1200-15&blocks%5B1%5D.htmlContentComponent=T2S_pdp_history_html&blocks%5B1%5D.thirdParty=TARGET2SELL&blocks%5B1%5D.analytics=`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
      const json = await response.json();
      const htmls = json.map(elm => elm.html);
      for (const html of htmls) {
        const div = document.createElement('div');
        div.setAttribute('class', 'added-pdp');
        div.innerHTML = html;
        document.body.append(div);
      }
    }
    async function addSponsored () {
      const productId = window.location.pathname.match(/[^\-]+$/)[0];
      const API = `https://d.eu.criteo.com/delivery/v2/api/page?~it=js&key=263&page-id=viewItem_Web&viewed-sku=${productId}&in-stock=1&abe=1`;
      const response = await fetch(API);
      const json = await response.json();
      const sponsored = Object.values(json).find(prop => prop.hasOwnProperty('ProductAd')).ProductAd.map(elm => elm.ProductName).join('|');
      const div = document.createElement('div');
      div.id = 'sponsored';
      div.innerHTML = sponsored;
      document.body.append(div);
    }
    try {
      await context.evaluate(addPDP);
    } catch (error) {
      console.log('Failed to add PDP');
    }
    try {
      await context.evaluate(addSponsored);
    } catch (error) {
      console.log('Failed to add ponsored');
    }
    return await context.extract(data, { transform });
  },
};
