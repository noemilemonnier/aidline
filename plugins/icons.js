import Vue from 'vue'

import {
  mdiPencil,
  mdiAccountMultiplePlusOutline,
  mdiClipboardAccountOutline,
  mdiClipboardMultipleOutline,
  mdiClipboardPlusOutline,
  mdiAmbulance,
  mdiDelete,
  mdiCardAccountDetailsOutline,
  mdiCreditCardPlusOutline,
  mdiCreditCardSettingsOutline,
  mdiEmail,
  mdiFace,
  mdiAccountPlusOutline,
  mdiFaceAgent,
  mdiHomeVariant,
  mdiLogin,
  mdiMicrophone,
  mdiMapMarker,
  mdiLockAlert,
  mdiThemeLightDark,
  mdiPhone,
} from '@mdi/js'

const icons = {
  mdiPencil,
  mdiDelete,
  mdiAccountMultiplePlusOutline,
  mdiAccountPlusOutline,
  mdiClipboardAccountOutline,
  mdiClipboardMultipleOutline,
  mdiClipboardPlusOutline,
  mdiAmbulance,
  mdiCardAccountDetailsOutline,
  mdiCreditCardPlusOutline,
  mdiCreditCardSettingsOutline,
  mdiEmail,
  mdiFace,
  mdiFaceAgent,
  mdiHomeVariant,
  mdiLogin,
  mdiMicrophone,
  mdiMapMarker,
  mdiLockAlert,
  mdiThemeLightDark,
  mdiPhone,
}

export default ({ app }) => {
  const Icons = {
    install(vue, options) {
      vue.prototype.$i = icons
      app.$i = icons
    },
  }
  Vue.use(Icons)
}
