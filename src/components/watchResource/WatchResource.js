import React from "react";
import CurrentResourceContext from "../../contexts/CurrentResourceContext";
import Preloader from '../preloader/Preloader';
import * as Charts from '../chart/Charts';
import * as Buttons from '../buttons/Buttons';
import { reduceHour } from '../../utils/timeDiff.ts';
import { formatMemory, formatDate } from '../../constants/functions';

export default function WatchResource({ resourceClick, chartData, isFromZero, isPreloader, setIsPreloader }) {
    const currentResource = React.useContext(CurrentResourceContext);

    return (
        <section name='watch-resource' id='watch-resource'>
            <h3 className='watch-resource__title'>{currentResource ? currentResource.url : ''}</h3>
            <div className="add-button__container">
                <Buttons.ButtonAdd title='Reload' buttonText="Reload" onClick={() => { resourceClick(currentResource, () => { setIsPreloader(false) }) }} />
            </div>
            {isPreloader ?
                <Preloader />
                :
                <Charts.LineChart title={{ text: 'Time / % capacity in use' }} chartClass='watch-resource__chart' chartData={chartData} subtitle={false} isYZero={isFromZero} />
            }
            <div className='watch-resource__resource_info-container'>
                {currentResource ? <div className='watch-resource__container'>
                    <p className='zero-margin'>Resource: <span className={`${reduceHour(currentResource.lastChecked, 1) < new Date() ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{reduceHour(currentResource.lastChecked, 1) < new Date() ? (currentResource.isActive ? 'active' : 'not active') : 'not active'}</span></p>
                    <p className='zero-margin'>Status: <span className={`${reduceHour(currentResource.lastChecked, 1) < new Date() ? 'green' : 'red'}`}>{reduceHour(currentResource.lastChecked, 1) < new Date() ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {currentResource ? <p className='zero-margin'>{reduceHour(currentResource.lastChecked, 1) < new Date() ? 'A' : 'Last a'}vailable memory: {formatMemory(currentResource ? currentResource.memoryLeft : 0)} of {formatMemory(currentResource ? currentResource.totalMemory : 0)}</p> : <></>}
                {currentResource ? <p className='zero-margin'>Last checked: {formatDate(currentResource.lastChecked)}</p> : <></>}
                {currentResource ? (currentResource.status !== 200 ? <p className='zero-margin'>Last active: {formatDate(currentResource.lastActive)}</p> : <></>) : <></>}
            </div>
        </section>
    );
};
