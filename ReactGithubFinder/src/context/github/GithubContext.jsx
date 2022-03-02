import { createContext, useReducer } from "react"
import githubReducer from "./GithubReducer"

const GithubContext = createContext()

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    loading: false,
    user: {},
    repos: [],
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  // Get search results
  const searchUsers = async (text) => {
    setLoading()
    const params = new URLSearchParams({
      q: text,
    })
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`)
    const { items } = await response.json()

    dispatch({
      type: "GET_USERS",
      payload: items,
    })
  }
  // Get Single User
  const getUser = async (login) => {
    setLoading()

    const response = await fetch(`${GITHUB_URL}/users/${login}`)

    if (response.status === 404) {
      window.location = "/notfound"
    } else {
      const data = await response.json()

      dispatch({
        type: "GET_USER",
        payload: data,
      })
    }
  }
  // Get user repos
  const getUserRepos = async (login) => {
    setLoading()
    console.log(login)
    const params = new URLSearchParams({
      sort: "created",
      per_page: 10,
    })
    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`)
    const data = await response.json()

    dispatch({
      type: "GET_REPOS",
      payload: data,
    })
  }
  // Clear users from state
  const clearUsers = () => dispatch({ type: "CLEAR_USERS" })

  // Set Loading
  const setLoading = () => dispatch({ type: "SET_LOADING" })

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        loading: state.loading,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
