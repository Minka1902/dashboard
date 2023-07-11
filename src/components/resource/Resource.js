import React from "react";
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";
import { changeStringLength } from "../../constants/constants";

export default function Resource(props) {
    const { resource, onClick, isRefresh } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);
    const [isHovering, setIsHovering] = React.useState(false);

    const setIsPreloaderFalse = () => setIsPreloader(false);

    const resourceClick = (evt) => {
        evt.preventDefault();
        if (!evt.target.classList.contains('resource__button')) {
            if (evt.target.classList.contains('resource__reload-icon')) {
                setIsPreloader(true);
                onClick(resource, setIsPreloaderFalse);
                setIsHovering(false);
            }
        }
    };

    const calculatePercentage = () => {
        const percent = resource.memoryLeft * 100;
        return (percent / resource.totalMemory).toFixed(2);
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedDate = `${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedDate;
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
                            <img className={`resource__image ${resource.name}`} src={resource.status === 200 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Green_Light_Icon.svg/1200px-Green_Light_Icon.svg.png' : ''} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                            <h3 className={`resource__200_text ${resource.name}`} title={`${calculatePercentage()}%`}><ProgressBar value={calculatePercentage()} maxValue={100} /></h3>
                        </>
                    );
                } else {
                    return (
                        <>
                            <img className={`resource__image ${resource.name}`} src={resource.status === 200 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Green_Light_Icon.svg/1200px-Green_Light_Icon.svg.png' : ''} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                            <h3 className={`resource__200_text ${resource.name}`} title={`http://${resource.url}`}>{formatDate(resource.updatedAt)}</h3>
                        </>
                    );
                }
            } else {
                return (<>
                    {
                        resource.memoryLeft ?
                            <div className={`resource__memory_content ${resource.name}`}>
                                <ProgressBar value={calculatePercentage()} maxValue={100} />
                            </div>
                            :
                            <></>
                    }
                    <h3 className={`resource__error-text${resource.totalMemory ? '' : ' no-memory'} ${resource.name}`}>Last active: {formatDate(resource.lastActive)} <br /><br />Last tried: {formatDate(resource.lastChecked)}</h3>
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
            <div className={`resource`} id={resource._id} onClick={resourceClick}>
                <div className={`resource__name_container ${resource.name}`}>
                    <h3 className={`resource__name ${resource.name}`} title={resource.name}>{formatName(resource.name)}</h3>
                </div>
                {!isPreloader ? <>
                    <div className={`resource__reload${isHovering ? ' opacity02' : ''} ${resource.name}`}></div>
                    <div className={`resource__reload-icon ${resource.name}`} title={resource.status === 200 ? `Last checked: ${formatDate(resource.lastChecked)}` : ""} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} />
                </> : <></>}
                {renderInfo()}
            </div>
        </>
    );
};
