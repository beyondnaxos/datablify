# Datablify

Datablifly is a React component that renders a table with data and provides functionalities such as search and row limit options. It is styled with CSS modules.

## Installation

To install Datablify, you can use either npm or yarn:

```bash
npm install datablify
```

```bash
yarn add datablify
```

## Usage

To use Datablify in your React project, you need to import it and pass it the required props:
(you can use as many data items as you want in condition that they have the same lenght as the categories prop )

```javascript
import { Datablify } from 'datablify'

const MyComponent = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 40 },
  ]

  const categories = ['ID', 'Name', 'Age']

  return (
    <Datablify
      data={data}
      categories={categories}
      headColor={'black'}
      titleHeadColor={'white'}
    />
  )
}
```

## Props

Datablify accepts the following props:

- `data`: An array of objects that contains the data to be displayed in the table. Each object should have the same keys as the categories prop.
- `categories`: An array of strings that contains the categories for the table. Each string should correspond to a key in the objects of the data prop.
- `headColor`: A string that contains the color of the table header. 
- `titleHeadColor`: A string that contains the color of the table header title. 

## Functionalities

Datablify provides the following functionalities:

- Search: A search input is provided for filtering the table rows by keyword. The search is case-insensitive.
- Row limit: A dropdown is provided for limiting the number of rows displayed in the table.
- Copy to clipboard: Clicking on a cell in the table will copy its text to the clipboard and display a "Copied" message. The message will disappear after 750 milliseconds.
- Responsive: The table is responsive and will collapse into a vertical list on smaller screens.
- headerColor: The color custom of the table header.
- titleHeadColor: The color custom of the table header title.

## Styling

Datablify is styled with CSS modules, which means that you can override its styles by targeting the class names generated by the CSS modules. The following class names are used:

- `tableCompContainer`: The main container for the component.
- `viewAndSearch`: The container for the row limit and search input.
- `limitViewContainer`: The container for the row limit dropdown.
- `searchInput`: The search input.
- `tableContainer`: The container for the table.
- `categoryHandle`: The row for the categories.
- `categoryHandleStyle`: A class that is always applied to the categoryHandle row.
- `title`: The cell for a category.
- `tableRow`: The row for a data item.
- `rowData`: The cell for a data item.
- `dataTables_empty`: The row that is displayed when there are no matching records for the search.

## License

MIT © [datablify]
