
export function observeCards() {
    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entrie => {
            console.log(entrie);
            // entrie.contentRect.height = entrie.contentRect.width
            entrie.target.style.height = entrie.contentRect.width + 'px';
            document.querySelector('.cards').style.gridTemplateRows= `repeat(4, ${entrie.contentRect.height}px)`;
        })
        
    })
    document.querySelectorAll('.card').forEach(el => {
        resizeObserver.observe(el)
    })
    
    console.log(document.querySelectorAll('.card'));
}