import React from 'react';

// TODO  data = {epsg: epsgCode, distance: (coords to point0), point0}
// ?     <Table tableHeaders={['Id', 'Name', 'Email']} data={data} />
export default function PrettyTable(props) {
    const { tableHeaders, data, coordinates } = props;
    const [isTableOpen, setIsTableOpen] = React.useState(true);

    const toggleIsTableOpen = () => setIsTableOpen(!isTableOpen);

    return (
        <>
            <div className={`table__toggle-button${isTableOpen ? ' _toggled' : ''}`} title={isTableOpen ? 'Close table' : 'Open table'} onClick={toggleIsTableOpen}></div>
            <div className={`table-container${isTableOpen ? '' : '_invissible'}`}>
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
                    {coordinates ? <tfoot>
                        <tr>
                            <td>Clicked</td>
                            <td>Latitude: {coordinates.latitude}</td>
                            <td>Longtitude: {coordinates.longtitude}</td>
                        </tr>
                    </tfoot> : <></>}
                </table>
            </div>
        </>
    );
};
