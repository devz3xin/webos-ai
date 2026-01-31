let zIndexCounter = 100;

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('system-clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

const appConfigs = {
    notepad: {
        title: "Notepad",
        content: '<textarea class="notepad-area"></textarea>',
        width: '400px',
        height: '300px'
    },
    calc: {
        title: "Calcolatrice",
        content: `
            <div class="calc-screen" id="calc-res">0</div>
            <div class="calc-grid">
                ${[7,8,9,'/',4,5,6,'*',1,2,3,'-',0,'C','=','+'].map(btn => `<button onclick="calcInput('${btn}')">${btn}</button>`).join('')}
            </div>
        `,
        width: '250px',
        height: 'auto'
    },
    explorer: {
        title: "File Explorer",
        content: `
            <div class="explorer-grid">
                ${['Documenti', 'Immagini', 'Video', 'Download', 'Musica'].map(f => `<div class="folder">📁<br>${f}</div>`).join('')}
            </div>
        `,
        width: '450px',
        height: '320px'
    }
};

function openApp(appKey) {
    const config = appConfigs[appKey];
    const win = document.createElement('div');
    win.className = 'window';
    win.style.width = config.width;
    win.style.top = '100px';
    win.style.left = '100px';
    win.style.zIndex = ++zIndexCounter;

    win.innerHTML = `
        <div class="window-header">
            <span class="window-title">${config.title}</span>
            <div class="window-controls">
                <div class="control min"></div>
                <div class="control max"></div>
                <div class="control close" onclick="this.closest('.window').remove()"></div>
            </div>
        </div>
        <div class="window-content">${config.content}</div>
    `;

    document.getElementById('window-container').appendChild(win);
    makeDraggable(win);
    
    win.addEventListener('mousedown', () => {
        win.style.zIndex = ++zIndexCounter;
    });
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('.window-header');
    
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

let calcState = "";
function calcInput(val) {
    const res = document.getElementById('calc-res');
    if (val === 'C') calcState = "";
    else if (val === '=') {
        try { calcState = eval(calcState); } catch { calcState = "Error"; }
    } else {
        calcState += val;
    }
    res.innerText = calcState || "0";
}