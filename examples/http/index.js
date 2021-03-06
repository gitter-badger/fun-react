import React from 'react'
import ReactDOM from 'react-dom'
import {Observable} from 'rx'
import {
  createTypes,
  createUpdate,
  component,
  createProgram,
} from '../../src'

/**
 * This is an example ported from http://elm-lang.org/examples/http
 */

const Msg = createTypes(
  'MorePlease',
  'FetchSucceed',
  'FetchFail'
)

const getRandomGif = topic => {
  const url =
    "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + topic

  const json = fetch(url).then(res => res.json())
  return Observable.fromPromise(json)
  .map(json => json.data.image_url)
  .map(Msg.FetchSucceed)
}

const init = topic => [
  {
    topic,
    gifUrl: "waiting.gif"
  },
  [getRandomGif(topic)]
]

const update = createUpdate({
  [Msg.MorePlease]: (event, model) =>
    [model, getRandomGif(model.topic)],

  [Msg.FetchSucceed]: (newUrl, model) =>
    [{...model, gifUrl: newUrl}, []],

  [Msg.FetchFail]: (event, model) =>
    [model, []],
})

const HttpExample = component('HttpExample', ({event}, props) => {
  return props.get('model').map(model => (
    <div>
      <h2>{model.topic}</h2>
      <button onClick={event(Msg.MorePlease)}>More Please!</button>
      <br />
      <img src={model.gifUrl} />
    </div>
  ))
})

const rootEl = document.getElementById('app')

const Program = createProgram({
  init: init('cats'),
  update,
  view: HttpExample
})

ReactDOM.render(<Program />, rootEl)
