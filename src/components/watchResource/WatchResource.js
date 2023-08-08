import React from "react";
import CurrentResourceContext from "../../contexts/CurrentResourceContext";
import Preloader from '../preloader/Preloader';
import * as Charts from '../chart/Charts';
import * as Buttons from '../buttons/Buttons';
import { reduceMinute } from '../../utils/timeDiff.ts';
import { formatMemory, formatDate } from '../../constants/functions';

export default function WatchResource({ resourceClick, chartData, isFromZero, isPreloader, setIsPreloader }) {
    const currentResource = React.useContext(CurrentResourceContext);
    const now = new Date();

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
                    <p className='zero-margin'>Resource: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 10) ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 10) ? (currentResource.isActive ? 'active' : 'not active') : 'not active'}</span></p>
                    <p className='zero-margin'>Status: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 10) ? 'green' : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 10) ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {currentResource ? <p className='zero-margin'>{new Date(currentResource.lastChecked) > reduceMinute(now, 10) ? 'A' : 'Last a'}vailable memory: {formatMemory(currentResource ? currentResource.memoryLeft : 0)} of {formatMemory(currentResource ? currentResource.totalMemory : 0)}</p> : <></>}
                {currentResource ? <p className='zero-margin'>Last checked: {formatDate(currentResource.lastChecked)}</p> : <></>}
                {currentResource ? (currentResource.status !== 200 ? <p className='zero-margin'>Last active: {formatDate(currentResource.lastActive)}</p> : <></>) : <></>}
            </div>
        </section>
    );
};
