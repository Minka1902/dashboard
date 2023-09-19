import React from "react";
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";
import { formatDate } from '../../constants/functions';
import { changeStringLength } from "../../constants/functions";
import { SvgMore } from "../../images/SvgComponents";
import { reduceMinute } from '../../utils/timeDiff.ts';

export default function Resource(props) {
    const { resource, onClick, isRefresh, lastEntry } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);

    const setIsPreloaderFalse = () => setIsPreloader(false);

    const resourceClick = (evt) => {
        evt.preventDefault();
        if (evt.target.classList.length !== 0 && !evt.target.classList.contains("preloader__circle")) {
            if (evt.target.classList.contains('resource__reload-icon')) {
                setIsPreloader(true);
                onClick(resource, setIsPreloaderFalse);
            } else {
                if (evt.target.previousSibling !== null) {
                    if (evt.target.previousSibling.classList.contains('resource__reload-icon')) {
                        setIsPreloader(true);
                        onClick(resource, setIsPreloaderFalse);
                    }
                }
            }
        }
    };

    const calculatePercentage = () => {
        const percent = resource.capacityLeft * 100;
        return (percent / resource.totalCapacity).toFixed(2);
    };

    const renderInfo = () => {
        if (isPreloader || isRefresh) {
            return (
                <Preloader text="Reloading, please wait." />
            );
        } else {
            const now = reduceMinute(Date(), 5);
            if (new Date(resource.lastChecked) > now && lastEntry) {
                if (resource.status === 200 && resource.isActive) {
                    return (
                        <>
                            <div className="resource__image">
                                <div className={`resource__reload-icon ${resource.name}`} />
                                <div className={`resource__image_light${new Date(lastEntry.checkedAt) > now ? '_green' : '_red'}`} title={`Last checked: ${formatDate(resource.lastActive)}`}></div>
                            </div>
                            <div className={`resource__200_text ${resource.name}`} title={`${100 - calculatePercentage()}%`}>
                                {resource.capacityLeft ? <ProgressBar value={100 - calculatePercentage()} maxValue={100} /> : <b>{formatDate(resource.lastChecked, false, false)}</b>}
                            </div>
                        </>
                    );
                } else {
                    if (resource.status === 500 && resource.isActive) {
                        return (<>
                            {
                                resource.capacityLeft ?
                                    <div className={`resource__memory_content ${resource.name}`}>
                                        <ProgressBar value={100 - calculatePercentage() * 1} maxValue={100} />
                                    </div>
                                    :
                                    <></>
                            }
                            <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                            <h3 className={`resource__error-text${resource.totalCapacity ? '' : ' no-memory'} ${resource.name}`}>{lastEntry === null ? 'Resource has no gAgent' : 'gAgent gets a bad response from the resource'} <br /><br />Last tried: {formatDate(resource.lastChecked, false)}</h3>
                            <h3 className={`resource__status ${resource.status === 200 ? (new Date(resource.lastChecked) > now ? '' : 'not-') : 'not-'}working ${resource.name}`} title={`http://${resource.url}`} >{new Date(resource.lastChecked) > now ? resource.status : 'Not responding'}</h3>
                        </>);
                    } else {
                        if (resource.status === 400 && resource.isActive) {
                            return (<>
                                {
                                    resource.capacityLeft ?
                                        <div className={`resource__memory_content ${resource.name}`}>
                                            <ProgressBar value={100 - calculatePercentage() * 1} maxValue={100} />
                                        </div>
                                        :
                                        <></>
                                }
                                <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                                <h3 className={`resource__error-text${resource.totalCapacity ? '' : ' no-memory'} ${resource.name}`}>{lastEntry === null ? 'Resource has no gAgent' : 'There is a problem on our server'} <br /><br />Last tried: {formatDate(resource.lastChecked, false)}</h3>
                                <h3 className={`resource__status ${resource.status === 200 ? (new Date(resource.lastChecked) > now ? '' : 'not-') : 'not-'}working ${resource.name}`} title={`http://${resource.url}`} >{new Date(resource.lastChecked) > now ? resource.status : 'Not responding'}</h3>
                            </>);
                        } else {
                            return (<>
                                {
                                    resource.capacityLeft ?
                                        <div className={`resource__memory_content ${resource.name}`}>
                                            <ProgressBar value={100 - calculatePercentage() * 1} maxValue={100} />
                                        </div>
                                        :
                                        <></>
                                }
                                <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                                <h3 className={`resource__error-text${resource.totalCapacity ? '' : ' no-memory'} ${resource.name}`}>{lastEntry === null ? 'Resource has no gAgent' : 'Resource is not active'} <br /><br />Last tried: {formatDate(resource.lastChecked, false)}</h3>
                                <h3 className={`resource__status ${resource.status ? (new Date(resource.lastActive) > now ? '' : 'not-') : 'not-'}working ${resource.name}`} title={`http://${resource.url}`} >{new Date(resource.lastChecked) > now ? resource.status : 'Not responding'}</h3>
                            </>);
                        }
                    }
                }
            } else {
                return (<>
                    {
                        resource.capacityLeft ?
                            <div className={`resource__memory_content ${resource.name}`}>
                                <ProgressBar value={100 - calculatePercentage() * 1} maxValue={100} />
                            </div>
                            :
                            <></>
                    }
                    <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                    <h3 className={`resource__error-text${resource.totalCapacity ? '' : ' no-memory'} ${resource.name}`}>{lastEntry === null ? 'Resource has no gAgent' : 'This resource is not active for the last 5 minutes'} <br /><br />Last tried: {formatDate(resource.lastChecked, false)}</h3>
                    <h3 className={`resource__status ${resource.status === 200 ? (new Date(resource.lastChecked) > now ? '' : 'not-') : 'not-'}working ${resource.name}`} title={`http://${resource.url}`} >{new Date(resource.lastChecked) > now ? resource.status : 'Not responding'}</h3>
                </>);
            }
        }
    };

    const formatName = (name) => {
        let newName = '';
        if (name.length > 13) {
            newName = `${changeStringLength(name, 10)}...`;
            return newName;
        }
        return name;
    };

    React.useEffect(() => {
        if (isRefresh) {
            onClick(resource, setIsPreloaderFalse);
        }
    }, [isRefresh]);   //eslint-disable-line

    return (resource ?
        <>
            <div className={`resource${resource.capacityLeft !== undefined ? ' capacity' : ''}`} id={resource._id} onClick={resourceClick}>
                <div className={`resource__name_container ${resource.name}`}>
                    <h3 className={`resource__name ${resource.name}`} title={resource.name}>{formatName(resource.name)}</h3>
                    <div className="resource__more-button" title='More options'>
                        <SvgMore />
                    </div>
                </div>
                {renderInfo()}
            </div>
        </> : <></>
    );
};
