import React from 'react';
import '../../styles/dataset/SingleDataset.css';

function SingleDataset() {
  return (
    <div className='d-flex flex-md-row flex-column' style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <div className='py-3 col-md-7 col-lg-8'>
        <div className='py-3'>
          <div className='single-dataset-head'>Title</div>
          <div className='single-dataset-subhead'>Description</div>
        </div>
      </div>
      <div className='col-md-5 col-lg-4'>
        <div className='py-5 single-dataset-details'>
          <div className='py-sm-5 py-4'>
            <button
            type="submit"
            className="py-2 px-5 btn single-dataset-download"
            >
              Download
            </button>
          </div>
          <div className='pt-sm-4 pt-2 px-md-5 single-dataset-content'>
            <div className='py-3'>
              <div className='single-dataset-details-head'>Category</div>
              <div className='single-dataset-details-value'>Value</div>
            </div>
            <div className='py-3'>
              <div className='single-dataset-details-head'>Attributes</div>
              <div className='single-dataset-details-value'>Value</div>
            </div>
            <div className='py-3'>
              <div className='single-dataset-details-head'>Price Per Data</div>
              <div className='single-dataset-details-value'>Value</div>
            </div>
            <div className='py-3'>
              <div className='single-dataset-details-head'>No.of Data Records</div>
              <div className='single-dataset-details-value'>Value</div>
            </div>
            <div className='py-2'>
              <div className='single-dataset-details-head'>Final Cost</div>
              <div className='single-dataset-details-value'>Value</div>
            </div>
            <div className='py-4'>
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-3 px-sm-5 dataset-buy-btn"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleDataset