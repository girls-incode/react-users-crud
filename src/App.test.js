import React from 'react';
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import App from './App';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure ({adapter : new Adapter()});

describe('AppBundle', () => {
  test('renders without crashing', () => {
      const AppBundle = (
          <Provider store={store}>
            <App />
          </Provider>
      );
      const div = document.createElement("div");
      ReactDOM.render(AppBundle, div);
  });
});

describe('<App />', () => {
  test('renders without crashing', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.exists()).toBe(true)
  });
});