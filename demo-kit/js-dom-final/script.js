console.log("script.js is running")

const title = document.getElementById("page-title")
title.textContent = "Trainer Profile (with JavaScript)"

const cards = document.querySelectorAll(".card")
console.log(cards)

const countText = document.querySelector("#card-count")
countText.textContent = cards.length + " sections on this page"

const teamList = document.querySelector("#team ol")
const newPokemon = document.querySelector("#new-pokemon")
const addButton = document.querySelector("#add-pokemon")

const addPokemon = () => {
  if (newPokemon.value.trim() === "") return
  const item = document.createElement("li")
  item.textContent = newPokemon.value
  teamList.appendChild(item)
  newPokemon.value = ""
}

addButton.addEventListener("click", addPokemon)

const about = document.querySelector("#about")
about.addEventListener("mousemove", (evt) => {
  const box = about.getBoundingClientRect()
  const xRatio = 1 - (evt.clientX - box.left) / box.width
  const value = Math.round(255 * xRatio)
  evt.currentTarget.style.backgroundColor = `rgb(255, ${value}, ${value})`
})

const form = document.querySelector("form")
const output = document.querySelector("#output")

form.addEventListener("submit", (evt) => {
  evt.preventDefault()
  const formProps = Object.fromEntries(new FormData(evt.target))
  output.textContent = "Battle request from " + formProps.trainer + " (" + formProps.favorite + ")"
})

document.querySelector("#team").addEventListener("click", (evt) => {
  evt.currentTarget.classList.toggle("picked")
})

teamList.addEventListener("click", (evt) => {
  if (evt.target.tagName === "LI") {
    evt.target.remove()
    evt.stopPropagation()
  }
})
