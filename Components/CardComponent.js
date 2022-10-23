const CardComponent = {
    render(data) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="cardSide back" data-id="${data.id}"></div>
            <img src="${data.src.small}" alt="image" class="cardSide front">
        `
        return card;
    },
    renderEmptyCards() {
        const cards = [];
        for(let i = 0; i < 16; i++) {
            cards.push(`
                <div class="card"><div class="cardSide back"></div></div>
            `);
        }
        return cards.join('')
    }
}


export default CardComponent;