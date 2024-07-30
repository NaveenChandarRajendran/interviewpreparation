import React from 'react';

const TableStructure = () => {
    return (
        <table border="1">
            <thead>
                <tr>
                    <th rowspan="2">Merged Row Header</th>
                    <th>Column 1</th>
                    <th>Column 2</th>
                </tr>
                <tr>
                    <td>Row 2, Col 1</td>
                    <td>Row 2, Col 2</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Row 3, Col 1</td>
                    <td>Row 3, Col 2</td>
                </tr>
            </tbody>
        </table>
    )
}

export default TableStructure;