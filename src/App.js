import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Dataset from "./pages/Dataset";
import DatasetForm from "./pages/DatasetForm";
import IndividualDataset from "./pages/IndividualDataset";
import ModelForm from "./pages/ModelForm";
import Model from "./pages/Model";
import IndividualModel from "./pages/IndividualModel";
import Computation from "./pages/Computation";
import Visualization from "./pages/Visualization";
import EfficientComputation from "./pages/EfficientComputation";
import { useState } from "react";
import "./App.css";



function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={ <Registration />}/>
          <Route path="/user-dashboard" element={<Dashboard />}/>
          <Route path="/user-dashboard/*" element={<Dashboard />}/>
          <Route path="/dataset-marketplace" element={<Dataset/>}></Route>
          <Route path="/dataset-marketplace/*" element={<Dataset/>}></Route>
          <Route path="/dataset-marketplace/create-dataset" element={<DatasetForm/>}></Route>
          <Route path="/dataset-marketplace/single-dataset" element={<IndividualDataset/>}></Route>
          <Route path="/model-marketplace" element={<Model/>}></Route>
          <Route path="/model-marketplace/*" element={<Model/>}></Route>
          <Route path="/model-marketplace/create-model" element={<ModelForm/>}></Route>
          <Route path="/model-marketplace/single-model" element={<IndividualModel/>}></Route>
          <Route path="/de-computation" element={<Computation/>}></Route>
          <Route path="/de-computation/*" element={<Computation/>}></Route>
          <Route path="/de-computation/advanced-visualization-computing" element={<Visualization/>}></Route>
          <Route path="/de-computation/efficient-computing" element={<EfficientComputation/>}></Route>
        </Routes>
      </BrowserRouter>
      {/* <RouterProvider router={router}/> */}
    </div>
  );
}

export default App;
