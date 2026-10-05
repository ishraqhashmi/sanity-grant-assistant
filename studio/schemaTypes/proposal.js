export default {
  name: 'proposal',
  title: 'Proposal',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required()},
    {name: 'organisation', title: 'Organisation', type: 'string'},
    {name: 'programmeArea', title: 'Programme area', type: 'string'},
    {name: 'region', title: 'Region', type: 'string'},
    {name: 'problemStatement', title: 'Problem statement', type: 'text'},
    {name: 'objectives', title: 'Objectives', type: 'array', of: [{type: 'string'}]},
    {name: 'activities', title: 'Activities', type: 'array', of: [{type: 'string'}]},
    {name: 'beneficiaries', title: 'Beneficiaries', type: 'string'},
    {name: 'budgetTotal', title: 'Budget total', type: 'number'},
    {name: 'outcomes', title: 'Outcomes', type: 'array', of: [{type: 'string'}]},
    {name: 'status', title: 'Status', type: 'string', options: {list: ['draft', 'submitted', 'approved', 'rejected']}}
  ]
}
