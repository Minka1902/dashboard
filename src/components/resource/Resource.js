import React from "react";
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";
import { formatDate } from '../../constants/functions';
import { changeStringLength } from "../../constants/constants";

export default function Resource(props) {
    const { resource, onClick, isRefresh } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);

    const setIsPreloaderFalse = () => setIsPreloader(false);

    const resourceClick = (evt) => {
        evt.preventDefault();
        if (!evt.target.classList.contains('resource__button')) {
            if (evt.target.classList.contains('resource__reload-icon')) {
                setIsPreloader(true);
                onClick(resource, setIsPreloaderFalse);
            }
        }
    };

    const calculatePercentage = () => {
        const percent = resource.memoryLeft * 100;
        return (percent / resource.totalMemory).toFixed(2);
    };

    const renderInfo = () => {
        if (isPreloader || isRefresh) {
            return (
                <Preloader text="Reloading, please wait." />
            );
        } else {
            if (resource.status === 200) {
                if (resource.memoryLeft) {
                    return (
                        <>
                            <div className="resource__image">
                                <div className={`resource__reload-icon ${resource.name}`} />
                                <div className="resource__image_light" title={`Last checked: ${formatDate(resource.lastChecked)}`}></div>
                            </div>
                            <h3 className={`resource__200_text ${resource.name}`} title={`${100 - calculatePercentage()}%`}><ProgressBar value={100 - calculatePercentage()} maxValue={100} /></h3>
                        </>
                    );
                } else {
                    return (
                        <>
                            <div className="resource__image">
                                <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                                <div className="resource__image_light" title={`Last checked: ${formatDate(resource.lastChecked)}`}></div>
                            </div>
                            <h3 className={`resource__200_text ${resource.name}`} title={`http://${resource.url}`}>{formatDate(resource.updatedAt, false)}</h3>
                        </>
                    );
                }
            } else {
                return (<>
                    {
                        resource.memoryLeft ?
                            <div className={`resource__memory_content ${resource.name}`}>
                                <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                                <ProgressBar value={calculatePercentage()} title={`${100 - calculatePercentage()}%`} maxValue={100} />
                            </div>
                            :
                            <></>
                    }
                    <div className={`resource__reload-icon ${resource.name}`} title={`Last checked: ${formatDate(resource.lastChecked)}`} />
                    <h3 className={`resource__error-text${resource.totalMemory ? '' : ' no-memory'} ${resource.name}`}>Last active: {formatDate(resource.lastActive)} <br /><br />Last tried: {formatDate(resource.lastChecked, false)}</h3>
                    <h3 className={`resource__status ${resource.status === 200 ? '' : 'not-'}working ${resource.name}`} title={`http://${resource.url}`} >{resource.status}</h3>
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

    return (
        <>
            <div className={`resource ${resource.memoryLeft !== undefined ? 'memory' : ''}`} id={resource._id} onClick={resourceClick}>
                <div className={`resource__name_container ${resource.name}`}>
                    <h3 className={`resource__name ${resource.name}`} title={resource.name}>{formatName(resource.name)}</h3>
                </div>
                {renderInfo()}
            </div>
        </>
    );
};
