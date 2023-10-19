import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }


      const userExists = this.entries.find(entry => entry.login === username)
      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }

}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }



  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }


  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow(user)

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })



  }

  createRow(user) {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/${user.login}.png" alt="Imagem de ${user.name}">
        <a href="https://github.com/${user.login}" target="_blank">
          <p>${user.name}</p>
          <span>${user.login}</span>
        </a>
      </td>
      <td class="repositories">
        ${user.public_repos}
      </td>
      <td class="followers">
        ${user.followers}
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    });
  }
}