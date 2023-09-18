import React from "react";
import CurrentResourceContext from "../../contexts/CurrentResourceContext";
import LastEntryContext from "../../contexts/LastEntryContext";
import Preloader from '../preloader/Preloader';
import * as Charts from '../chart/Charts';
import * as Buttons from '../buttons/Buttons';
import { reduceMinute } from '../../utils/timeDiff.ts';
import { formatMemory, formatDate } from '../../constants/functions';

export default function WatchResource({ resourceClick, chartData, isFromZero, isPreloader, setIsPreloader, isCapacity }) {
    const currentResource = React.useContext(CurrentResourceContext);
    const lastEntry = React.useContext(LastEntryContext);
    const now = new Date();

    const calculatePercentage = (isCapacity) => {
        if (isCapacity) {
            const percent = currentResource.capacityLeft * 100;
            return (percent / currentResource.totalCapacity).toFixed(2);
        } else {
            const percent = currentResource.freeMemory * 100;
            return (percent / currentResource.totalMemory).toFixed(2);
        }
    };

    return (
        <section name='watch-resource' id='watch-resource'>
            <h3 className='watch-resource__title'>{currentResource ? currentResource.url : ''}</h3>
            <div className="refresh-button__container">
                <Buttons.ButtonSVG title='Reload' buttonText="Reload" onClick={() => { resourceClick(currentResource, () => { setIsPreloader(false) }) }} />
            </div>

            {isPreloader ?
                <Preloader />
                :
                <Charts.LineChart
                    title={{ text: !currentResource.totalCapacity && !currentResource.totalMemory ? 'Time / 0-Disabled 1-Active' : (isCapacity ? 'Time / Capacity in use' : 'Time / % Memory in use') }}
                    maxY={currentResource.totalMemory !== undefined ? 100 : 1}
                    chartClass='watch-resource__chart'
                    chartData={chartData}
                    subtitle={false}
                    isYZero={chartData && chartData[0].status ? true : isFromZero}
                    isCapacity={isCapacity}
                />
            }
            <div className='watch-resource__resource_info-container'>
                {currentResource ? <div className='watch-resource__container'>
                    <p className='zero-margin'>Resource: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? (currentResource.isActive ? 'active' : 'not active') : 'Not active'}</span></p>
                    <p className='zero-margin'>Status: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 5) && currentResource.status === 200 ? 'green' : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {currentResource.totalCapacity ? <p className='zero-margin'>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? 'A' : 'Last a'}vailable capacity: <b>{formatMemory(currentResource.capacityLeft)}</b> of {formatMemory(currentResource.totalCapacity)}. Which are <b>{calculatePercentage(true)}%</b>.</p> : <></>}
                {currentResource.totalMemory ? <p className="zero-margin">{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? 'A' : 'Last a'}vailable RAM: <b>{formatMemory(currentResource.freeMemory)}</b> of {formatMemory(currentResource.totalMemory)}. Which are <b>{calculatePercentage(false)}%</b>.</p> : <></>}
                {lastEntry && new Date(lastEntry.checkedAt) > reduceMinute(now, 10) ? <p className='zero-margin green'>gAgent last update: {formatDate(lastEntry.checkedAt)}</p> : <p className="zero-margin red">{currentResource.name}'s gAgent last entry was {formatDate(lastEntry.checkedAt)}</p>}
            </div>
        </section>
    );
};
