import React from 'react';
import hero from '../../assets/computation/efficient2.png';
import add from '../../assets/computation/add.png'
import "../../styles/efficiency/EfficientCompute.css";

function EfficientCompute() {
  return (
    <div>
      <div className='py-4 efficient-compute-container'>
        <div>
          <img src={hero} className='efficient-compute-img'/>
        </div>
        <div className='py-3 efficient-compute-details'>
          <div className='py-3 d-flex efficient-compute-head'>
            Compute Your Model
          </div>
          <div className='efficient-compute-data'>
            <div className='py-2'>
              <div className='d-flex efficient-compute-dataset-text'>
                Enter Dataset URL
              </div>
              <div className='d-flex align-items-center'>
                <div className='py-2'>
                  <input type='text' className='efficient-compute-dataset-input' placeholder='Enter Dataset URL'/>
                </div>
                <div className='d-flex'>
                  <img className='efficient-compute-dataset-img' src={add} />
                </div>
              </div>
            </div>

            <div className='py-2'>
              <div className='d-flex efficient-compute-model-text'>
                Enter Model URL
              </div>
              <div className='d-xl-flex align-items-center'>
                <div className='py-2'>
                  <input type='text' className='efficient-compute-model-input' placeholder='Enter Model URL'/>
                </div>
                <div>
                  <button className='rounded-pill efficient-compute-model-btn'>Compute</button>
                </div>
              </div>
            </div>

            <div className='py-2'>
              <div className='efficient-compute-job-id'>Job id:</div>
            </div>

            <div className='d-flex py-2 align-items-center'>
              <div className='efficient-compute-cid'>cid:</div>
              <div className='px-3'>
                <button className='rounded-pill efficient-compute-cid-btn'>Get cid</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default EfficientCompute