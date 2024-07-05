document.addEventListener('DOMContentLoaded', function() {
    const tossButton = document.getElementById('tossButton');
    const coin = document.getElementById('coin');
    const resultText = document.getElementById('result');
    const tossSound = document.getElementById('tossSound');

    tossButton.addEventListener('click', function() {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';

        // Set result text to 'tossing'
        resultText.textContent = 'Tossing...';

        // Play toss sound
        tossSound.play();

        // Get the duration of the audio
        const duration = tossSound.duration * 1000; // Convert to milliseconds

        // Show spinning coin
        coin.style.display = 'block';
        coin.className = 'coin spinning';

        // Reset animation
        coin.style.animation = 'none';
        // Trigger reflow to restart the animation
        void coin.offsetWidth;
        // Start spin animation
        coin.style.animation = `spin ${duration / 1000}s linear`;

        // Display result after animation
        setTimeout(() => {
            coin.className = 'coin ' + result;
            resultText.textContent = result === 'heads' ? 'Heads' : 'Tails';
        }, duration); // Match the duration of the animation and sound
    });
});
