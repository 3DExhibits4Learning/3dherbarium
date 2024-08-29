/**
 * @file /utils/modelThumbnails.ts
 * @fileoverview contains a map with a key of the model UID and a value of the thumbnail path. Used
 * for when displaying model thumbnails on the model search page.
 */

import { StaticImageData } from 'next/image';

import Achillea_millefolium from '../components/Search/Thumbnails/Achillea_millefolium.png';
import Acer_macrophyllum from '../components/Search/Thumbnails/Acer_macrophyllum.png';
import Alnus_rubra from '../components/Search/Thumbnails/Alnus_rubra.png';
import Arctostaphylos_uva_ursi from '../components/Search/Thumbnails/Arctostaphylos_uva-ursi.png';
import Baccharis_pilularis from '../components/Search/Thumbnails/Baccharis_pilularis.png';
import Callistemon_citrinus from '../components/Search/Thumbnails/Callistemon_citrinus.png';
import Calocedrus_decurrens from '../components/Search/Thumbnails/Calocedrus_decurrens.png';
import Carpobrotus_edulis from '../components/Search/Thumbnails/Carpobrotus_edulis.png';
import Ceanothus_hearstiorum from '../components/Search/Thumbnails/Ceanothus_hearstiorum.png';
import Ceanothus_thyrsiflorus from '../components/Search/Thumbnails/Ceanothus_thyrsiflorus.png';
import Choisya_ternata from '../components/Search/Thumbnails/Choisya_ternata.png';
import Darlingtonia_californica from '../components/Search/Thumbnails/Darlingtonia_californica.png';
import Ephedra_viridis from '../components/Search/Thumbnails/Ephedra_viridis.png';
import Erigeron_glaucus from '../components/Search/Thumbnails/Erigeron_glaucus.png';
import Festuca_rubra from '../components/Search/Thumbnails/Festuca_rubra.png';
import Garrya_elliptica from '../components/Search/Thumbnails/Garrya_elliptica.png';
import Gaultheria_shallon from '../components/Search/Thumbnails/Gaultheria_shallon.png';
import Ginkgo_biloba from '../components/Search/Thumbnails/Ginkgo_biloba.png';
import Hedera_helix from '../components/Search/Thumbnails/Hedera_helix.png';
import Iris_chrysophylla from '../components/Search/Thumbnails/Iris_chrysophylla.png';
import Juniperus_chinensis from '../components/Search/Thumbnails/Juniperus_chinensis.png';
import Magnolia_grandiflora from '../components/Search/Thumbnails/Magnolia_grandiflora.png';
import Maianthemum_dilatatum from '../components/Search/Thumbnails/Maianthemum_dilatatum.png';
import Penstemon_heterophyllus from '../components/Search/Thumbnails/Penstemon_heterophyllus.png';
import Phoradendron_leucarpum from '../components/Search/Thumbnails/Phoradendron_leucarpum.png';
import Polypodium_scouleri from '../components/Search/Thumbnails/Polypodium_scouleri.png';
import Pseudotsuga_menziesii from '../components/Search/Thumbnails/Pseudotsuga_menziesii.png';
import Psilotum_nudum from '../components/Search/Thumbnails/Psilotum_nudum.png';
import Rhododendron_arboreum from '../components/Search/Thumbnails/Rhododendron_occidentale.png';
import Ribes_sanguineum from '../components/Search/Thumbnails/Ribes_sanguineum.png';
import Rosmarinus_officinalis from '../components/Search/Thumbnails/Rosmarinus_officinalis.png';
import Salicornia_pacifica from '../components/Search/Thumbnails/Salicornia_pacifica.png';
import Salvia_apiana from '../components/Search/Thumbnails/Salvia_apiana.png';
import Sequoia_sempervirens from '../components/Search/Thumbnails/Sequoia_sempervirens.png';
import Sisyrinchium_bellum from '../components/Search/Thumbnails/Sisyrinchium_bellum.png';
import Sisyrinchium_striatum from '../components/Search/Thumbnails/Sisyrinchium_striatum.png';
import Vaccinium_ovatum_aj from '../components/Search/Thumbnails/Vaccinium_ovatum_aj.png';
import Vaccinium_ovatum_david from '../components/Search/Thumbnails/Vaccinium_ovatum_david.png';
import Vaccinium_parvifolium from '../components/Search/Thumbnails/Vaccinium_parvifolium.png';
import Verbena_bonariensis from '../components/Search/Thumbnails/Verbena_bonariensis.png';


export const MODEL_THUMBNAILS: Record<string, StaticImageData> = {
  "f5fe7ddef261481f9e32dbb71cb10a34": Achillea_millefolium,
  "6a7b87e2ff98433daa34b3da43092f86": Acer_macrophyllum,
  "ca37de74282f4eb7af25e3ab81e761ff": Alnus_rubra,
  "6c43a98d66be4ece892b38ca34442405": Arctostaphylos_uva_ursi,
  "f787b06cf8ed4ef79998c17393d54f9a": Baccharis_pilularis,
  "4bde1d6c0cad4b65885be90534a26848": Callistemon_citrinus,
  "428dbf7d4e4f49978cba34cd0f67f32f": Calocedrus_decurrens,
  "0ffc2362e33f4e83b13d200586cb1a9f": Carpobrotus_edulis,
  "b118dada3c334feebe8b94a0e0c5f4e4": Ceanothus_hearstiorum,
  "30d1c20da3c3458984793b7729d0303d": Ceanothus_thyrsiflorus,
  "7074859e64fe4751924c166155466117": Choisya_ternata,
  "ecf050830c494bd897e57d375cfc0ea6": Darlingtonia_californica,
  "1f98fffcae5e434b8e6bdc1ef62d7a8e": Ephedra_viridis,
  "68338c366c9e4f18b5d1cfb0b20306bb": Erigeron_glaucus,
  "eef5af0efbbb4ae1acabc402a3a26e54": Festuca_rubra,
  "9fa52dea9aa4459e979285b3481844f3": Garrya_elliptica,
  "709cd4b1e7c54157b0c1ebe25eb37f22": Gaultheria_shallon,
  "04cd6a565fb04f4c9557d385cb0d55a7": Ginkgo_biloba,
  "60418498966a4f339ac5d80abf68654d": Hedera_helix,
  "e088800a7733472aaa95dbc393ee6932": Iris_chrysophylla,
  "ca8149e231d142e0b7435d46bdf83633": Juniperus_chinensis,
  "e9461ec7163444af807bb710bddc7d99": Magnolia_grandiflora,
  "ae64a3739dfc4fa1a86171e120f18494": Maianthemum_dilatatum,
  "228d5fb2a3cc496292e887e5dcff3a27": Penstemon_heterophyllus,
  "d76a0ccd8d3e47ef9696b04650c9855d": Phoradendron_leucarpum,
  "b0ce4e5fc1ed486fad5b980bac85d486": Polypodium_scouleri,
  "0d6030e911024743a68df713bcbb5a88": Pseudotsuga_menziesii,
  "b645dd7d4ea54743b674ca51754946de": Psilotum_nudum,
  "d9b461bcc5b14965a7224097b8c72381": Rhododendron_arboreum,
  "88cddd7089744c389097ae39b3f869c9": Ribes_sanguineum,
  "6b4914c30d2b4599a2f4457570a4ba67": Rosmarinus_officinalis,
  "b9f0856454ef454598be9698893933d0": Salicornia_pacifica,
  "84e1b567afb04b7992bec8efb1a2bf4c": Salvia_apiana,
  "0115aa9368f74da8b9d2b1889f898fe5": Sequoia_sempervirens,
  "a8649632c78f478e9c4ce826a012873f": Sisyrinchium_bellum,
  "aff05e8e2b9e4d09b5491ecd9145cb71": Sisyrinchium_striatum,
  "2860b067be55466f8884551985b1aa20": Vaccinium_ovatum_aj,
  "6915cff41ccf40fa95c860dc885cff0e": Vaccinium_ovatum_david,
  "18dba716b531451fb6a9441a9a91ce0b": Vaccinium_parvifolium,
  "fcc87b02467045ea8fa50d4bb35ca098": Verbena_bonariensis,
  "": {
    src: '',
    height: 0,
    width: 0,
  }
}