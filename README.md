# redux-jwt

```sh
$ npm i @littlepony/redux-jwt
```

```js
import { createStore, applyMiddleware } from "redux";
import createJwtMiddleware from "@littlepony/redux-jwt";
import rootReducer from "./rootReducer";

const jwtMiddleware = createJwtMiddleware();

export default function configureStore(preloadedState) {
  const middlewares = [jwtMiddleware];
  const store = createStore(rootReducer, preloadedState, applyMiddleware(...middlewares));

  return store
}

const store = configureStore();

```

#### User dispatched actions

##### `JWT_LOGIN`
`login` action creator accepts an object with named parameters ('username' and 'password').
```js
import { login } from "@littlepony/redux-jwt";

store.dispatch(login({username: "root", password: "P@S$W0Rd"}))
```
##### `JWT_LOGOUT`
```js
import { logout } from "@littlepony/redux-jwt";

store.dispatch(logout())
```

##### `JWT_LOAD`
```js
import { load } from "@littlepony/redux-jwt";

class App extends Component {
    componentDidMount() {
        store.dispatch(load())
    }
}
```

#### Middleware dispatched actions

##### `JWT_UPDATE`

##### `JWT_ERROR`

#### Middleware options

```js
const jwtOptions = {
    storage: localStorage,
};

const jwtMiddleware = createJwtMiddleware(jwtOptions);
```
