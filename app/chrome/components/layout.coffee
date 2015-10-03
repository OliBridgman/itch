
component = require "./component"
LoginPage = require "./login_page"
LibraryPage = require "./library_page"

remote = window.require "remote"
AppStore = remote.require "./metal/stores/AppStore"
AppActions = remote.require "./metal/actions/AppActions"

Immutable = require "seamless-immutable"

get_state = ->
  JSON.parse AppStore.get_state_json()

module.exports = component {
  displayName: "Layout"

  getInitialState: ->
    get_state()

  componentDidMount: ->
    AppStore.add_change_listener 'layout', @_on_change

  componentWillUnmount: ->
    AppStore.remove_change_listener 'layout'

  render: ->
    switch @state.page
      when 'login'
        (LoginPage @state.login)
      when 'library'
        (LibraryPage @state.library)

  # non-React methods

  _on_change: ->
    setTimeout (=> @setState get_state()), 0
}
