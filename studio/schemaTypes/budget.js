export default {
  name: 'budget',
  title: 'Budget',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required()},
    {name: 'programmeArea', title: 'Programme area', type: 'string'},
    {name: 'currency', title: 'Currency', type: 'string'},
    {name: 'total', title: 'Total', type: 'number'},
    {name: 'lines', title: 'Budget lines', type: 'array', of: [{type: 'object', fields: [
      {name: 'category', title: 'Category', type: 'string'},
      {name: 'amount', title: 'Amount', type: 'number'}
    ]}]}
  ]
}
