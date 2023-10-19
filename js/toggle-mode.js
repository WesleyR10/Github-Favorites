let darkMode = true
const buttonToggle = document.querySelector('#toggle-mode')

buttonToggle.addEventListener('click', (ev) => {
  document.documentElement.classList.toggle('ligth')

  const mode = darkMode ? 'light' : 'dark'
  ev.currentTarget.querySelector('span').textContent = `${mode} mode ativado!`

  darkMode = !darkMode
})