import React from "react";
import Preloader from '../preloader/Preloader';

// TODO data = {epsg: epsgCode, distance: (coords to point0), point0}
// ! <Table tableHeaders={['Id', 'Name', 'Email']} data={data} />
export default function Table(props) {
    const { tableHeaders, data, isPreloader } = props;

    return (
        <div className="table-container">
            {isPreloader ? <Preloader text="find the closest EPSG code" />
                :
                <table>
                    <thead>
                        <tr>
                            {tableHeaders.map((header, index) => {
                                return <th key={index}>{header}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.epsg}</td>
                                <td>{item.distance ? item.distance : 'Unknown'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
        </div>
    );
};
