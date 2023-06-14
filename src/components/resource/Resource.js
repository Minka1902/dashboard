import React from "react";
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";
import { changeStringLength } from "../../constants/constants";

export default function Resource(props) {
    const { resource, onClick, deleteSource, isLoggedIn, isRefresh } = props;
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

    const deleteClick = (evt) => {
        evt.preventDefault();
        deleteSource(resource.name);
    };

    const calculatePrecentage = () => {
        const precent = resource.memoryLeft * 100;
        return precent / resource.totalMemory;
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
                return (
                    <>
                        <img className="resource__image" src={resource.status === 200 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Green_Light_Icon.svg/1200px-Green_Light_Icon.svg.png' : ''} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                        <h3 className="resource__200_text" title={`http://${resource.url}`}>{formatDate(resource.updatedAt)}</h3>
                    </>
                );
            } else {
                return (<>
                    {
                        resource.memoryLeft ?
                            <div className="resource__memory_content">
                                <ProgressBar value={calculatePrecentage()} maxValue={100} />
                            </div>
                            :
                            <></>
                    }
                    <h3 className={`resource__error-text ${resource.totalMemory ? '' : 'no-memory'}`}>Last active: {formatDate(resource.lastActive)} <br /><br />Last tried: {formatDate(resource.lastChecked)}</h3>
                    <h3 className={`resource__status ${resource.status === 200 ? '' : 'not-'}working`} title={`http://${resource.url}`} >{resource.status}</h3>
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
    }, [isRefresh]);

    return (
        <>
            <div className="resource" onClick={resourceClick}>
                <div className="resource__name_container">
                    <h3 className="resource__name" title={resource.name}>{formatName(resource.name)}</h3>
                    {!isPreloader ? <><div className={`resource__reload ${isHovering ? 'opacity02' : ''}`}></div><img className="resource__reload-icon" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} /></> : <></>}
                    {isLoggedIn ? <button className="resource__button" onClick={deleteClick} title='Delete source' /> : <></>}
                </div>
                {renderInfo()}
            </div>
        </>
    );
};
