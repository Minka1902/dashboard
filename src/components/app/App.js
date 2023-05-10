import React from 'react';
import Resource from '../resource/Resource';
import resourceApiObj from '../../utils/resourceApi';
import { resources } from '../../constants/constants';

export default function App() {

  const resourceArray = { 'Geomage.com': 'https://www.geomage.com/', '89.192.15.12': '2', 'nebius': '3', 'cloud.il': '4', '89.192.15.11': '5' };

  const resourceClick = (name, hidePreloader) => {
    const resourceUrl = resourceArray[name];
    if (resourceUrl) {
      resourceApiObj.refresh(resourceUrl)
        .then((data) => {
          if (data) {
            console.log(data);
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        })
        .finally(() => {
          hidePreloader();
        });
    }
  }

  return (
    <div className="app">
      {
        resources.map((resource, index) => {
          return <Resource resource={resource} key={index} onClick={resourceClick} />
        })
      }
    </div>
  );
}
