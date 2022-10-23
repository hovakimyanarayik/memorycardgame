const GameHeaderComponent = {
    render() {
        return `
            <div class="current-results">
                <p class="current-result">Moves: <span id="moves-count">0</span> </p>
                <p class="current-result">Timer: <span id="timer">00 : 00</span> </p>
            </div>
            <form id="startGame">
                <div class="image-types">
                    <label>
                        <input type="radio" name="image-type" value="animals" checked>
                        Animals
                    </label>
                    <label>
                        <input type="radio" name="image-type" value="nature">
                        Nature
                    </label>
                    <label>
                        <input type="radio" name="image-type" value="cakes">
                        Cakes
                </label>
                </div>
                <button id="startBtn" class="button">Sign Up/In</button>
            </form>
        `
    },

    afterRender(cb) {
        const gameStartForm = document.getElementById('startGame');
        gameStartForm.addEventListener('submit', cb)
    }
}


export default GameHeaderComponent;