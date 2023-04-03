import React from 'react';

import styles from './Datablify.module.css'

export const Datablify = ({ data, categories }) => {
  const isValidData = categories.length === Object.keys(data[0]).length

  let timeOutId = null

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
      <th key={index} className={styles.title}>
        {category}
      </th>
    ))
  }

  const getRow = (row, index) => {
    return Object.entries(row).map(([key, value]) => (
      <td
        key={index + Math.random()}
        className={styles.rowData}
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
    <section className={styles.tableCompContainer}>
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
              {data?.map((row, index) => (
                <tr className={`${styles.tableRow} tableRowLimit`} key={index}>
                  {getRow(row, index)}
                </tr>
              ))}
              <td class="dataTables_empty" style={{ display: 'none' }}>
                No matching records found
              </td>
            </tbody>
          </table>
        </>
      ) : (
        getError(data, categories)
      )}
    </section>
  )
}
