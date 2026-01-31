let zIndex = 1

const desktop = document.getElementById("desktop")
const tasks = document.getElementById("tasks")
const clock = document.getElementById("clock")

setInterval(() => {
  const d = new Date()
  clock.textContent = d.toLocaleTimeString()
}, 1000)

document.querySelectorAll(".desktop-icon").forEach(icon => {
  icon.onclick = () => openApp(icon.dataset.app)
})

function openApp(app) {
  const win = document.createElement("div")
  win.className = "window"
  win.style.top = "100px"
  win.style.left = "100px"
  win.style.zIndex = ++zIndex

  const title = document.createElement("div")
  title.className = "titlebar"
  title.innerHTML = `<span>${app}</span><div class="controls"><span>x</span></div>`

  const content = document.createElement("div")
  content.className = "content"

  if (app === "notepad") {
    content.innerHTML = `<textarea></textarea>`
  }

  if (app === "calculator") {
    content.innerHTML = `
      <input id="calc-display" style="width:100%;margin-bottom:5px">
      <div class="calc-grid">
        ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map(b=>`<button>${b}</button>`).join("")}
      </div>`
    content.querySelectorAll("button").forEach(btn=>{
      btn.onclick = () => {
        const d = content.querySelector("#calc-display")
        if(btn.textContent==="=") d.value = eval(d.value)
        else d.value += btn.textContent
      }
    })
  }

  if (app === "explorer") {
    content.innerHTML = `
      <div class="folder-grid">
        <div class="folder">📁 Documenti</div>
        <div class="folder">📁 Immagini</div>
        <div class="folder">📁 Download</div>
      </div>`
  }

  title.querySelector("span:last-child").onclick = () => win.remove()

  win.append(title, content)
  desktop.appendChild(win)

  drag(win, title)
}

function drag(win, bar) {
  let x=0,y=0,mx=0,my=0
  bar.onmousedown = e => {
    mx = e.clientX
    my = e.clientY
    win.style.zIndex = ++zIndex
    document.onmousemove = e2 => {
      x = mx - e2.clientX
      y = my - e2.clientY
      mx = e2.clientX
      my = e2.clientY
      win.style.top = win.offsetTop - y + "px"
      win.style.left = win.offsetLeft - x + "px"
    }
    document.onmouseup = () => document.onmousemove = null
  }
}
