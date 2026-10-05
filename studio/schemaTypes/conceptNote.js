export default {
  name: 'conceptNote',
  title: 'Concept note',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required()},
    {name: 'organisation', title: 'Organisation', type: 'string'},
    {name: 'programmeArea', title: 'Programme area', type: 'string'},
    {name: 'region', title: 'Region', type: 'string'},
    {name: 'summary', title: 'Summary', type: 'text'},
    {name: 'targetGroups', title: 'Target groups', type: 'array', of: [{type: 'string'}]},
    {name: 'estimatedBudget', title: 'Estimated budget', type: 'number'}
  ]
}
