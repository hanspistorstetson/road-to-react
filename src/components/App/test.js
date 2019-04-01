import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from '../App'
import Search from '../Search'
import Button from "../Button"
import Table from "../Table"

Enzyme.configure({adapter: new Adapter()});

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<App/>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })
});

describe('Search', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search>Search</Search>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<Search>Search</Search>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Button', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button onClick={() => null}>More</Button>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<Button onClick={() => null}>More</Button>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});


describe('Table', () => {

    const props = {
        list: [
            { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'a'},
            { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'b'},
        ],
        sortKey: 'TITLE',
        isSortReverse: false,
        onDismiss: () => null
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Table { ...props } />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('show two items in list', () => {
        const element = shallow(<Table {...props} />);
        expect(element.find('.table-row').length).toBe(2);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<Table { ...props } />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
