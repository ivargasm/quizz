//identify the toggle switch HTML element
const colorModeSwitch = document.querySelector('#color-mode');

let theme = localStorage.getItem("theme")

document.documentElement.setAttribute('data-theme', theme)

colorModeSwitch.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})