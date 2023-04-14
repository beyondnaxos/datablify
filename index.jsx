import React from 'react'
import styles from './Datablify.module.css'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

  const nextPage = () => {
    if (currentPage !== nPages) console.log(currentPage)
    if (currentPage >= nPages) {
      setCurrentPage(1)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage !== 1) console.log(currentPage)
    if (currentPage <= 1) {
      setCurrentPage(pageNumbers.length)
    } else {
      setCurrentPage(currentPage - 1)
    }
  }

  const colorCurrentPage = (number) => {
    if (number === currentPage) {
      return 'black'
    }
  }

  const backgroundColorCurrentPage = (number) => {
    if (number === currentPage) {
      return 'white'
    }
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        style={{ order: 1 }}
        onClick={prevPage}
      >
        <span className={styles.paginationButtonIcon}>{'<'}</span>
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={styles.paginationButton}
          onClick={() => setCurrentPage(number)}
          style={{
            order: number + 1,
            color: colorCurrentPage(number),
            backgroundColor: backgroundColorCurrentPage(number),
          }}
        >
          {number}
        </button>
      ))}
      <button
        className={styles.paginationButton}
        style={{ order: pageNumbers.length + 1 }}
        onClick={nextPage}
      >
        <span className={styles.paginationButtonIcon}>{'>'}</span>
      </button>
    </div>
  )
}

export const Datablify = (props) => {
  const data = props.data

  const [customHeadColor, setCustomHeadColor] = React.useState("#020202")
  const [customTitleHeadColor, setCustomTitleHeadColor] = React.useState("#020202")
  const [sortColumn, setSortColumn] = React.useState(0)
  const [sortOrder, setSortOrder] = React.useState("asc")
  const [sortingState, setSortingState] = React.useState({
    activeCategory: "",
    direction: "",
  })
  const [displayData, setDisplayData] = React.useState([...data])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [recordsPerPage, setRecordsPerPage] = React.useState(10)
  const [searchTerm, setSearchTerm] = React.useState("")

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

  const currentRecords = displayData.slice(indexOfFirstRecord, indexOfLastRecord)
  const categories = props.categories
  const isValidData = categories.length === Object.keys(data[0]).length
  let headColor = props.headColor ? props.headColor : "black"
  let titleHeadColor = props.titleHeadColor ? props.titleHeadColor : "white"
  let timeOutId = null

  const nPages = Math.ceil(displayData.length / recordsPerPage)
  const [sortTrigger, setSortTrigger] = React.useState(true);

  React.useEffect(() => {
    setCustomHeadColor(headColor)
    setCustomTitleHeadColor(titleHeadColor)
  }, [headColor, titleHeadColor])

  React.useEffect(() => {
    const filteredData = data.filter((record) => {
      const recordValues = Object.values(record)
      const recordValuesString = recordValues.join(" ")
      return recordValuesString.toLowerCase().includes(searchTerm)
    })
    setDisplayData(filteredData)
    setCurrentPage(1)
    setSortTrigger((prev) => !prev);
  }, [searchTerm])

  React.useEffect(() => {
    const sortedData = [...displayData]
    if (sortColumn !== null && sortOrder !== null) {
      const isAsc = sortOrder === "asc"
        sortedData.sort((a, b) => {
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
    }
    setDisplayData(sortedData)
    // setCurrentPage(1)
  }, [ sortTrigger, sortColumn, sortOrder])


  const copyToClipboard = (e) => {
    if (timeOutId === null) {
      const text = e.target.innerText
      const copied = "Copied"
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
    setRecordsPerPage(limit)
    setCurrentPage(1)
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
              direction: sortingState.direction === "asc" ? "desc" : "asc",
            })
          } else {
            setSortingState({
              activeCategory: category,
              direction: "asc",
            })
          }
          handleSort(index)
        }}
      >
        {category}
        {sortingState.activeCategory === category && (sortingState.direction === "asc" ? " ▲" : " ▼")}
      </th>
    ))
  }

  const getRow = (row, index) => {
    return Object.entries(row).map(([key, value]) => (
      <td key={index + Math.random()} className={styles.rowData} style={{ textAlign: "start" }} onClick={(e) => copyToClipboard(e)}>
        {value}
      </td>
    ))
  }

  const getError = (data, categories) => {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Error</h1>
        <p className={styles.errorText}>Categories and datas are not corresponding</p>
        <p className={styles.errorCompare}>
          you have <span className={styles.counter}>{categories.length}</span> categories and <span className={styles.counter}>{Object.keys(data[0]).length}</span> value(s) per row{" "}
        </p>
      </div>
    )
  }

  const handleSort = (index) => {
    if (sortColumn === index) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(index)
      setSortOrder("asc")
    }
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
    setSearchTerm(search)
  }

  return (
    <section className={styles.tableCompContainer} style={{ overflowX: "auto" }}>
      {isValidData ? (
        <>
          <div className={styles.viewAndSearch}>
            <div className={styles.limitViewContainer}>
              <span className={styles.spaninfo}>Show</span>
              {getSelect()}
              <span className={styles.spaninfo}>entries</span>
            </div>
            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div>
              <input onKeyUp={(e) => searchInput(e)} onPaste={(e) => searchInput(e)} type="text" className={styles.searchInput} placeholder="Search..." />
            </div>
          </div>
          <table className={styles.tableContainer}>
            <thead>
              <tr className={`${styles.categoryHandle} categoryHandleStyle`}>{getCategories(categories)}</tr>
            </thead>
            <tbody>
              {/* currentRecords ou sortedData */}
              {currentRecords?.map((row, index) => (
                <tr className={`${styles.tableRow} tableRowLimit`} key={index}>
                  {getRow(row, index)}
                </tr>
              ))}
              <tr className="dataTables_empty" style={{ display: "none" }}>
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
