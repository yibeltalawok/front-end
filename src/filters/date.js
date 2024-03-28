export default value => {

    const dt = new Date(value)
    return dt.toLocaleString(["en-US"], {
        month: 'short',
        day: '2-digit',
        year: "numeric"
    })
}