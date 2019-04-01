import React, {Component} from 'react';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import Button from '../Button'
import Search from '../Search'
import Table from '../Table'
import withLoading from '../withLoading';

import './index.css';
import {
    DEFAULT_QUERY,
    DEFAULT_HPP,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE,
    PARAM_HPP,
} from '../../constants/';

library.add(faArrowUp, faArrowDown);

const ButtonWithLoading = withLoading(Button);

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
            sortKey: 'NONE',
            isSortReverse: false,
        };

    }

    onSort = sortKey => {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse })
    };

    onDismiss = id => {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];


        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId)

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page}
            }
        })
    }

    onSearchChange = event => {
        this.setState({searchTerm: event.target.value})
    };

    needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

    onSearchSubmit = event => {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm})

        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    };



    fetchSearchTopStories = (searchTerm, page = 0) => {
        this.setState({ isLoading: true });
        axios.get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this.setSearchTopStories(result.data))
            .catch(error => this.setState({ error }));
    };

    updateSearchTopStoriesState = (hits, page) => (prevState) => {
        const { searchKey, results } = prevState;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        return {
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page},
            },
            isLoading: false
        };
    };

    setSearchTopStories = result => {
        const {hits, page} = result;
        this.setState(this.updateSearchTopStoriesState(hits, page));
    };

    componentDidMount() {
        const {searchTerm} = this.state
        this.setState({ searchKey: searchTerm})
        this.fetchSearchTopStories(searchTerm)

    }


    render() {
        const {
            searchTerm,
            results,
            searchKey,
            error,
            isLoading,
            sortKey,
            isSortReverse
        } = this.state;


        const page = (results && results[searchKey] && results[searchKey].page) || 0;

        const list = ( results && results[searchKey] && results[searchKey].hits) || [];



        return (
            <div className='page'>
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {error ? <div className={"interactions"}><p>Something went wrong.</p></div> :
                    <Table
                        list={list}
                        sortKey={sortKey}
                        onSort={this.onSort}
                        isSortReverse={isSortReverse}
                        onDismiss={this.onDismiss}/>
                }
                <div className={"interactions"}>
                    <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</ButtonWithLoading>
                </div>
            </div>
        );
    }
}



export default App;
