
function observeCards() {
    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entrie => {
            entrie.target.style.height = entrie.contentRect.width + 'px';
            document.querySelector('.cards').style.gridTemplateRows= `repeat(4, ${document.querySelector('.card').offsetWidth }px)`;
        })
        
    })
    document.querySelectorAll('.card').forEach(el => {
        resizeObserver.observe(el)
    })
}


export default observeCards