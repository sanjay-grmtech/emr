// Reference implementation

// Ref: https://stackoverflow.com/questions/43841778/vue-js-how-to-use-in-mixins-in-single-file-template
import reminderClientTbl from '~/components/patient-data/reminders/db/client-side/structure/reminders-of-a-patient-table.js' // Path without @ can be resolved by vsCode. Hence do not use webpack specific @ sign that represents src folder.
import recommendationClientTbl from '~/components/patient-data/recommendations/db/client-side/structure/recommendations-of-a-patient-table.js'
import miscNotesClientTbl from '~/components/patient-data/miscellaneous-notes/db/client-side/structure/miscellaneous-notes-of-a-patient-table.js'
import planCommentsClientTbl from '~/components/patient-data/plan-comments/db/client-side/structure/plan-comments-of-a-patient-table.js'
import processNotesClientTbl from '~/components/patient-data/process-notes/db/client-side/structure/process-notes-of-a-patient-table.js'
// defining all rows in this object
const clientTbl = {
  reminders: reminderClientTbl,
  recommendations: recommendationClientTbl,
  plan_comments: planCommentsClientTbl,
  miscellaneous_notes: miscNotesClientTbl,
  process_notes: processNotesClientTbl,
} // 1st row

export default {
  props: {
    firstProp: {
      type: Number,
    },
  },
  methods: {
    mxOpenAddCtInEditLayer() {
      this.$store.commit('mtfShowNewFirstTabInEditLayerFromSearchPhrase', {
        searchTerm: this._formDef.id,
      })
    },
    mxOpenMultiEditCtInEditLayer() {
      this.$store.commit('mtfShowNewFirstTabInEditLayerFromSearchPhrase', {
        searchTerm: this._formDef.id,
      })
    },
    mxOpenDDialog() {
      let confirmMessage = 'Are you sure you want to delete all the selected reminders?'
      if (this.daSelectedRemForDelete.length === 0) {
        confirmMessage = 'No reminder selected. Please select at least one reminder.'
      }

      this.$confirm(confirmMessage, 'Multi delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(async () => {
          if (this.daSelectedRemForDelete.length > 0) {
            const status = await clientTbl[this._formDef.id].fnSendMultiDeleteDataToServer(this.daSelectedRemForDelete)
            if (status.success > 0) {
              this.$message({
                type: 'success',
                message: status.success + ' reminder deleted.',
              })
            }
            if (status.failed > 0) {
              this.$message({
                type: 'error',
                message: status.failed + ' reminder failed to delete. Please try again later.',
              })
            }
          }
          console.log('daSelectedRemForDelete=====>', this.daSelectedRemForDelete)
        })
        .catch(() => {
          console.log('multi delete cancelled')
        })
    },
    async mxOpenTrashCanCtInEditLayer() {
      const deletedRows = await clientTbl[this._formDef.id].fnGetDeletedRows()
      const arDrawerData = []
      deletedRows.forEach((item) => {
        const arRow = []
        arRow.content = item.description
        const date = new Date(item.ROW_END * 1000)
        arRow.deletedAt = date.toLocaleString()

        arDrawerData.push(arRow)
      })
      console.log('deletedRows====>', deletedRows)
      this.$store.commit('mtfSetDeletedDrawerValue', {
        visibility: true,
        drawerTitle: 'Deleted reminders',
        drawerData: arDrawerData,
      })
    },
    mfIconDeleteClickedOnChildCard(pClientDataRowId) {
      const arResultsFromOrm = clientTbl[this._formDef.id].find(pClientDataRowId)

      this.$prompt(arResultsFromOrm.description, 'Delete reminder', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        inputPlaceholder: 'Enter delete note',
      })
        .then(async ({ value }) => {
          const status = await clientTbl[this._formDef.id].sfSendDeleteDataToServer(
            pClientDataRowId,
            arResultsFromOrm.serverSideRowUuid,
            value
          )
          if (status === 1) {
            this.$message({
              type: 'success',
              message: 'Reminder deleted.',
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Something went wrong. Please try again later.',
            })
          }
          console.log('delete status ======> ', status)
        })
        .catch(() => {
          console.log('Delete cancelled')
        })
    },
    mxHandleSelectionForDelete(val) {
      this.daSelectedRemForDelete = val
    },
  },
}
