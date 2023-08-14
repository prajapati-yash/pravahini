import React from 'react'
import "../../styles/computation/ComputationDetails.css";
import efficient from '../../assets/computation/efficient1.png';
import advanced from '../../assets/computation/visualization1.png'
import { useNavigate } from 'react-router-dom';

function ComputationDetails() {
  const navigate = useNavigate();
  return (
    <div className='container-fluid'>
      <div className='d-flex py-3 computation-details-title'>
        Introducing our two powerful containers tailored to your specific needs:
      </div>
      <div className='d-flex flex-md-row flex-column py-4 px-md-0 px-sm-4 justify-content-around'>
        <div className='col-md-5 mb-3 computation-details-container1'>
          <div className='py-3 px-3 computation-details-container1-head'>Efficient Computing</div>
          <div className='py-3 computation-details-container1-content'>
            <div className='py-2'>
              <img className='computation-details-img1' src={efficient}/>
            </div>
            <div className='py-2'>
              <button className='py-2 px-4 btn rounded-pill computation-details-btn1' onClick={() => navigate('/computation/efficient')}>Use Now</button>
            </div>
          </div>
        </div>
        <div className='col-md-5 mb-3  computation-details-container2'>
          <div className='py-3 px-3 computation-details-container2-head'>
            Advanced Visualization and Computation
          </div>
          <div className='py-3 computation-details-container2-content'>
            <div className='py-2'>
              <img className='computation-details-img2' src={advanced}/>
            </div>
            <div className='py-2'>
              <button className='py-2 px-4 btn rounded-pill computation-details-btn2' onClick={() => navigate('/computation/visualization')}>Use Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComputationDetails