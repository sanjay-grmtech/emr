<template>
  <ctEditFormTemplate :_formDef="formDef" :firstProp="_rowIdForEdit"></ctEditFormTemplate>
</template>

<script>
import ctEditFormTemplate from '@/components//papers/change-appt-note/templates/edit-form.vue'
import { medicalReviewOfSystemFormDef } from '@/components/patient-data/medical-review-of-system/db/client-side/structure/medical-review-of-system-of-a-patient-table.js'

export default {
  data: function () {
    return {
      formDef: medicalReviewOfSystemFormDef,
    }
  },
  props: {
    _rowIdForEdit: {
      type: Number,
    },
  },

  mounted() {
  },

  created() {},

  components: {
    ctEditFormTemplate,
  },
}
</script>
