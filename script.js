(function () {
    'use strict';

    var canvas = document.getElementById('star-canvas');
    var ctx = canvas.getContext('2d');
    var stars = [];
    var numStars = 100;

    function initStars() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (var i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            s.x += s.vx / 100;
            s.y += s.vy / 100;
            if (s.x < 0) s.x = canvas.width;
            if (s.x > canvas.width) s.x = 0;
            if (s.y < 0) s.y = canvas.height;
            if (s.y > canvas.height) s.y = 0;
        }
        requestAnimationFrame(drawStars);
    }

    initStars();
    drawStars();
    window.addEventListener('resize', initStars);

    var dot = document.getElementById('cursor-dot');
    var trail = document.getElementById('cursor-trail');
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var trailX = mouseX;
    var trailY = mouseY;

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        var distX = mouseX - trailX;
        var distY = mouseY - trailY;
        trailX += distX * 0.15;
        trailY += distY * 0.15;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var entryScreen = document.getElementById('entry-screen');
    var mainContent = document.getElementById('main-content');
    var audio = document.getElementById('bg-music');
    var playingNotice = document.getElementById('playing-notice');
    var playingLabel = playingNotice.querySelector('.playing-label');
    var playingDetail = document.getElementById('playing-detail');
    var entered = false;

    function showPlayingNotice() {
        playingNotice.hidden = false;
        requestAnimationFrame(function () {
            playingNotice.classList.add('is-visible');
        });
    }

    function showAudioLoadError() {
        playingNotice.classList.add('is-error');
        if (playingLabel) playingLabel.textContent = 'No audio';
        if (playingDetail) {
            playingDetail.textContent =
                'audio.mp3 failed to load or play. Check that the file is a valid MP3 next to index.html.';
        }
    }

    function clearAudioLoadError() {
        playingNotice.classList.remove('is-error');
        if (playingLabel) playingLabel.textContent = 'Playing';
        if (playingDetail) playingDetail.textContent = 'Co-Pilot — Just Hush';
    }

    audio.addEventListener('error', function () {
        if (!entered) return;
        showAudioLoadError();
    });

    audio.addEventListener('playing', function () {
        clearAudioLoadError();
    });

    function startExperience() {
        if (entered) return;
        entered = true;
        audio.volume = 0.5;

        entryScreen.style.opacity = '0';
        setTimeout(function () {
            entryScreen.style.display = 'none';
        }, 800);
        mainContent.classList.add('visible');
        showPlayingNotice();

        var p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(function (e) {
                console.error('Playback failed:', e);
                showAudioLoadError();
            });
        }

        if (audio.error) {
            showAudioLoadError();
        }
    }

    entryScreen.addEventListener('click', startExperience);

    audio.load();

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && entered && audio.paused && !audio.error) {
            audio.play().catch(function () {});
        }
    });
})();
