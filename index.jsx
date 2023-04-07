import React from 'react'
import styles from './Datablify.module.css'

export const Datablify = (props) => {

  const [customHeadColor, setCustomHeadColor] = React.useState('#020202')
  const [customTitleHeadColor, setCustomTitleHeadColor] = React.useState('#020202')
  const [sortColumn, setSortColumn] = React.useState(null)
  const [sortOrder, setSortOrder] = React.useState(null)
  const [sortingState, setSortingState] = React.useState({
    activeCategory: '',
    direction: ''
  })

  const data = props.data
  const categories = props.categories
  const isValidData = categories.length === Object.keys(data[0]).length
  let headColor = props.headColor? props.headColor : 'black'
  let titleHeadColor = props.titleHeadColor?  props.titleHeadColor : 'white'
  let timeOutId = null

  React.useEffect(() => {
    setCustomHeadColor(headColor)
    setCustomTitleHeadColor(titleHeadColor)
  }, [headColor, titleHeadColor])

  const copyToClipboard = (e) => {
    if (timeOutId === null) {
      const text = e.target.innerText
      const copied = 'Copied'
      navigator.clipboard.writeText(text)
      e.target.innerText = copied
      timeOutId = setTimeout(() => {
        e.target.innerText = text
        timeOutId = null
      }, 750)
    }
  }

  const limitRows = (e) => {
    const limit = Number(e.target.value)
    const myrows = document.querySelectorAll('.tableRowLimit')
    myrows.forEach((row, index) => {
      if (index >= limit) {
        console.log('change')
        row.style.display = 'none'
      } else {
        console.log('changed')
        row.style.display = 'table-row'
      }
    })
  }

  const getCategories = (categories) => {
    return categories.map((category, index) => (
      <th
        key={index}
        className={styles.title}
        style={{ 
          backgroundColor: customHeadColor,
          color: customTitleHeadColor,
        }}
        onClick={() => {
          if (sortingState.activeCategory === category) {
            setSortingState({
              ...sortingState,
              direction: sortingState.direction === 'asc' ? 'desc' : 'asc'
            })
          } else {
            setSortingState({
              activeCategory: category,
              direction: 'asc'
            })
          }
          handleSort(index)
        }}
      >
        {category}
        {sortingState.activeCategory === category &&
          (sortingState.direction === 'asc' ? ' ▲' : ' ▼')}
      </th>
    ))
  }

  const getRow = (row, index) => {
    return Object.entries(row).map(([key, value]) => (
      <td
        key={index + Math.random()}
        className={styles.rowData}
        style={{ textAlign: 'start' }} 
        onClick={(e) => copyToClipboard(e)}
      >
        {value}
      </td>
    ))
  }

  const getError = (data, categories) => {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Error</h1>
        <p className={styles.errorText}>
          Categories and datas are not corresponding
        </p>
        <p className={styles.errorCompare}>
          you have <span className={styles.counter}>{categories.length}</span>{' '}
          categories and{' '}
          <span className={styles.counter}>{Object.keys(data[0]).length}</span>{' '}
          value(s) per row{' '}
        </p>
      </div>
    )
  }

  const handleSort = (index) => {
    if (sortColumn === index) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(index)
      setSortOrder('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (sortColumn !== null && sortOrder !== null) {
      const isAsc = sortOrder === 'asc'
      return data.sort((a, b) => {
        const valueA = a[Object.keys(a)[sortColumn]]
        const valueB = b[Object.keys(b)[sortColumn]]
        if (isAsc) {
          if (valueA < valueB) {
            return -1
          } else if (valueA > valueB) {
            return 1
          } else {
            return 0
          }
        } else {
          if (valueA > valueB) {
            return -1
          } else if (valueA < valueB) {
            return 1
          } else {
            return 0
          }
        }
      })
    } else {
      return data
    }
  }, [data, sortColumn, sortOrder])

  const getSelect = () => {
    return (
      <select onChange={(e) => limitRows(e)}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    )
  }

  const searchInput = (e) => {
    const search = e.target.value.toLowerCase()
    const myrows = document.querySelectorAll('.tableRowLimit')
    const emptyRow = document.querySelector('.dataTables_empty')
    let hasMatch = false
    myrows.forEach((row) => {
      const rowText = row.innerText.toLowerCase()
      if (rowText.includes(search)) {
        row.style.display = 'table-row'
        hasMatch = true
      } else {
        row.style.display = 'none'
      }
    })
    emptyRow.style.display = hasMatch ? 'none' : 'table-row'
  }

  return (
    <section
      className={styles.tableCompContainer}
      style={{ overflowX: 'auto' }}
    >
      {isValidData ? (
        <>
          <div className={styles.viewAndSearch}>
            <div className={styles.limitViewContainer}>
              <span className={styles.spaninfo}>Show</span>
              {getSelect()}
              <span className={styles.spaninfo}>entries</span>
            </div>
            <div>
              <input
                onKeyUp={(e) => searchInput(e)}
                onPaste={(e) => searchInput(e)}
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
              />
            </div>
          </div>
          <table className={styles.tableContainer}>
            <thead>
              <tr className={`${styles.categoryHandle} categoryHandleStyle`}>
                {getCategories(categories)}
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((row, index) => (
                <tr className={`${styles.tableRow} tableRowLimit`} key={index}>
                  {getRow(row, index)}
                </tr>
              ))}
              <tr className="dataTables_empty" style={{ display: 'none' }}>
                <td>No matching records found</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        getError(data, categories)
      )}
    </section>
  )
}