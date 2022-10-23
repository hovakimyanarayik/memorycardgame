class WinMessage {
    constructor(timer, movesCount) {
        this.minutes = timer.split(':')[0]
        this.seconds = timer.split(':')[1].slice(1)
        this.moves = movesCount
    }
    show() {
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modalOverlay');
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <h1>You Win</h1>
            <p>Your result: ${this.moves} moves for ${this.minutes == '00 ' ? '0' : '00'} minutes and ${this.seconds} seconds</p>
            <button class="button">Close</button>
            
        `;
        modalOverlay.appendChild(modal)
        document.body.appendChild(modalOverlay)
        modalOverlay.addEventListener('click', WinMessage.destroy)
    }

    static destroy(e) {
        if(e.target.tagName == 'BUTTON' || e.target.classList.contains('modalOverlay')) {
            document.querySelector('.modalOverlay').remove()
        }
        
    }

}

export default WinMessage;