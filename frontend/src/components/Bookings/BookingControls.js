import React from 'react';


const bookingControls = props => (
    <div className='d-flex justify-content-center mb-4'>
        <button
            type="button"
            className={`btn btn-primary mr-1 ${props.selectedTab === 'list' ? 'btn-primary' : 'btn-light'}`}
            onClick={props.onChangeTab.bind(this, 'list')}>
            List
        </button>
        <button
            type="button"
            className={`btn btn-primary ${props.selectedTab === 'chart' ? 'btn-primary' : 'btn-light'}`}
            onClick={props.onChangeTab.bind(this, 'chart')}>
            Chart
        </button>
    </div>
)

export default bookingControls;
