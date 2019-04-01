import React, { Component } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import Button from '../Button'

const largeColumn = {
    width: '40%',
};
const midColumn = {
    width: '30%',
};
const smallColumn = {
    width: '10%',
};

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};

class Table extends Component {
    render() {
        const {list, onDismiss, sortKey, onSort, isSortReverse } = this.props;
        const sortedList = SORTS[sortKey](list);
        const orderedSortedList = isSortReverse ? sortedList.reverse() : sortedList;
        return (
            <div className="table">
                <div className={'table-header'}>
                    <span style={{ width: '40%'}}>
                        <Sort
                            sortKey={'TITLE'}
                            onSort={onSort}
                            activeSortKey={sortKey}
                            isSortReverse={isSortReverse}
                        >
                            Title
                        </Sort>
                    </span>
                    <span style={{ width: '30%' }}>
                        <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Author</Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Comments</Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Points</Sort>
                    </span>
                    <span style={{width: '10%' }}>
                        Archive
                    </span>
                </div>


                {orderedSortedList.map(item => {
                    return (
                        <div key={item.objectID} className="table-row">
                            <span style={largeColumn}>
                                <a href={item.url}>{item.title}</a>
                            </span>
                            <span style={midColumn}>
                                {item.author}
                            </span>
                            <span style={smallColumn}>
                                {item.num_comments}
                            </span>
                            <span style={smallColumn}>
                                {item.points}
                            </span>
                            <span style={smallColumn}>
                                <Button onClick={() => onDismiss(item.objectID)}
                                        className="button-inline">Dismiss</Button>
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }
}

const Sort = ({ sortKey, onSort, activeSortKey, isSortReverse, children }) =>{
    const sortClass = classNames(
        'button-inline',
        { 'button-active': sortKey === activeSortKey}
    );

    const arrowIcon = isSortReverse ? 'arrow-down' : 'arrow-up';


    return (
        <Button onClick={() => onSort(sortKey)} className={sortClass}>
            {children} { sortKey === activeSortKey ? <FontAwesomeIcon icon={arrowIcon} /> : null}
        </Button>
    );
};

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            url: PropTypes.string,
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired
};

export default Table;
