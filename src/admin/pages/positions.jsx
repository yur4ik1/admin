import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import ReactPaginate from 'react-paginate';

import { protectedRoute } from "../utils/auth.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import Loading from "../components/loading/Loading.jsx";
import AddPositions from "../components/popups/add-positions.jsx";

import { getPositions } from "../utils/fetches/positions/getPositions.js";

import { performSearch } from "../utils/fetches/positions/search.js";

import Position from "../components/elements/position.jsx";

export const Route = createFileRoute('/positions')({
    beforeLoad: ({ context, location }) => {
        protectedRoute({ location });
    },
    component: () => <Positions />
})

const Positions = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState(0);

    const [positions, setPositions] = useState([]);

    const [isPositionsPopupActive, setIsPositionsPopupActive] = useState(false);
    const [isPositionsSelectActive, setIsPositionsSelectActive] = useState(false)

    // search state
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([{}]);
    const [statusActive, setStatusActive] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

    // pagination code
    const [itemOffset, setItemOffset] = useState(0);
    const [itemsPerPage] = useState(5)
    const [selectedPositions, setSelectedPositions] = useState([]);


    const filteredPositions = selectedPositions.length !== 0 ? positions.filter(position => selectedPositions.includes(position.title)) : positions;

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredPositions.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredPositions.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % positions.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleOnChange = () => {
        setIsLoading(true);

        getPositions(limit, offset).then((data) => {
            setIsLoading(false);
            setPositions(data.data.departments);
        });
    }

    const onSearch = (search) => {
        if (search === '') {
            setSearchResults([]);
        }

        setSearch(search);
        performSearch(search, statusActive).then((data) => {
            setSearchResults(data.data.departments);
        });
    }

    const handleIsPositionsPopupActive = () => {
        setIsPositionsPopupActive(!isPositionsPopupActive);
    }

    const [isScrollPosition, setIsScrollPosition] = useState(0)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // functions for filtering
    const handlePositionSelect = (position) => {
        if (selectedPositions.includes(position)) {
            setSelectedPositions(selectedPositions.filter((pos) => pos !== position));
        } else {
            setSelectedPositions([...selectedPositions, position]);
        }
        window.scrollTo({ top: isScrollPosition });
    };

    const handleRemovePosition = (position) => {
        setSelectedPositions(selectedPositions.filter((pos) => pos !== position));
    };

    const filterPositions = () => {
        if (search === '') {
            return positions;
        } else {
            return positions.filter((position) => position.title.toLowerCase().startsWith(search.toLowerCase()));
        }
    };

    useEffect(() => {
        getPositions(limit, offset).then((data) => {
            setIsLoading(false);
            setPositions(data.data.departments);
        });
    }, [positions.departments_jobs, isLoading, limit, offset, globalSearch, statusActive]);

    useEffect(() => {
        const storedPositions = localStorage.getItem('selectedPositions');
        if (storedPositions) {
            setSelectedPositions(JSON.parse(storedPositions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedPositions', JSON.stringify(selectedPositions));
    }, [selectedPositions]);

    return (
        <MainLayout>
            {
                <Helmet>
                    <link rel="stylesheet" href={`/css/positions.css`} />
                </Helmet>
            }

            <div className="positions-page">
                <Header />

                <section className="another__wrapper">
                    <Sidebar />

                    <section className="content positions" id="positionsSection">
                        <div id='anchor'>
                            <h2>POSITIONS</h2>
                        </div>
                        <div className="add-department">
                            <a className="add-department-btn btn" onClick={handleIsPositionsPopupActive} href="#">Add Department</a>
                            <div className="field">
                                <div className="custom-select-wrapper" data-placeholder="Clan">
                                    <input type="text" className="visually-hidden custom-select__value"
                                        placeholder="Departament" />
                                    <span className="custom-select__label" onClick={() => setIsPositionsSelectActive(!isPositionsSelectActive)}>
                                        Department
                                    </span>
                                    {isPositionsSelectActive && (
                                        <div className="custom-select__selection">
                                            <div className="custom-select__selection-selected-items">
                                                {selectedPositions.map((position, index) => (
                                                    <div className="custom-select__selected-item" key={index}>
                                                        <span className="selected-item__text">
                                                            {position}
                                                        </span>
                                                        <button onClick={() => handleRemovePosition(position)} className="selected-item__button"></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Type here to Search"
                                                className="custom-select__selection-search"
                                                onChange={(e) => onSearch(e.target.value)}
                                            />
                                            <div className="custom-select__selection-inputs">
                                                {filterPositions().map((position, index) => (
                                                    <div key={index} className="custom-select__selection-input">
                                                        <input
                                                            className="visually-hidden"
                                                            type="checkbox"
                                                            id={position.id}
                                                            checked={selectedPositions.includes(position.title)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handlePositionSelect(position.title)
                                                            }}
                                                        />
                                                        <label htmlFor={position.id}>{position.title}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isLoading && <Loading />}
                        <div id="departments-view">
                            {currentItems.map((position) => (
                                <Position key={position.id} position={position} handleOnChange={handleOnChange}
                                    setIsLoading={setIsLoading} />
                            ))}
                        </div>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            ageRangeDisplayed={4}
                            marginPagesDisplayed={2}
                            containerClassName="navigation"
                            breakClassName="page-item"
                            pageLinkClassName="page-item"
                            previousClassName="page-item-button page-item-button-prev"
                            nextClassName="page-item-button page-item-button-next"
                            activeClassName="page-item-active"
                        />
                    </section>
                </section>
                {isPositionsPopupActive && <AddPositions handler={handleIsPositionsPopupActive} positions={positions} handleOnChange={handleOnChange} />}
            </div>
        </MainLayout>
    )
}

export default Positions

