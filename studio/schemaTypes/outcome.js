export default {
  name: 'outcome',
  title: 'Outcome',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required()},
    {name: 'programmeArea', title: 'Programme area', type: 'string'},
    {name: 'indicator', title: 'Indicator', type: 'string'},
    {name: 'baseline', title: 'Baseline', type: 'text'},
    {name: 'target', title: 'Target', type: 'text'},
    {name: 'evidence', title: 'Evidence', type: 'text'}
  ]
}
