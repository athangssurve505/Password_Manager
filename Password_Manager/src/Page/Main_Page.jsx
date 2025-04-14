import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Main_Page() {

  const [limitFetch, setLimitFetch] = useState(false);
  const [formData, setFormData] = useState({
    websiteName: "",
    username: "",
    password: "",
  });
  const [updatedData, setUpdatedData] = useState([{
    updatedWebsiteName: "",
    updatedUsername: "",
    updatedPassword: "",
  }]);

  const [dataList, setDataList] = useState([]);
  const [editingIds, setEditingIds] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentData = { ...formData }; // Save before reset

    await sendData(currentData); // pass it to API
  
    setDataList([...dataList, currentData]); // Update list after save
    setFormData({ websiteName: "", username: "", password: "" }); // Reset
  };

  const sendData = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/items",
        data
      );
      console.log("Item added:", response.data);
      // Optionally, reset form or show success message
    } catch (error) {
      console.error("There was an error adding the item!", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/items/data");
      setDataList(response.data);
      setUpdatedData(() =>
        response.data.map((item) => ({
          _id: item._id,
          updatedWebsiteName: item.websiteName,
          updatedUsername: item.username,
          updatedPassword: item.password,
        }))
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

      const updateData = async (_id, data) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/items/${_id}`, data);
      console.log("Item updated:", response.data);
      await fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  

  const toggleEditAndSave =  (index) => {
    setEditingIds((prev) => {
      const exists = prev.some(([itemId]) => itemId === index);
     
      if (exists) {
        const entry = updatedData[index];
        const data = {
          websiteName: entry.updatedWebsiteName,
          username: entry.updatedUsername,
          password: entry.updatedPassword
        };
         updateData(entry._id, data); // send actual updated values
  
        return prev.filter(([itemId]) => itemId !== index);
      } else {
        // Add new item
        return [...prev, [index, true]];
      }
    });
    
  };

  const handleUpdate = (e, index) => {
    const { name, value } = e.target;
  
    setUpdatedData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [name]: value,
      };
      return newData;
    });
  };
  
  const deleteData = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${_id}`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div
      className="container-fluid  py-5 mx-0"
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#f8f9fa",
        width: "100%",
      }}
    >
      <h1 className="text-center mb-4">🔐 My Password Manager</h1>
      <p className="text-center mb-5 text-secondary">
        Securely store your website credentials in one place. Add a site,
        username/email, and password below.
      </p>

      <form onSubmit={handleSubmit} className="mb-5 ">
        <div className="row g-3 d-flex flex-column gap-4 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              name="websiteName"
              value={formData.websiteName}
              onChange={handleChange}
              placeholder="Site Name"
              required
            />
          </div>
          <div className="col-12 col-md-6 col-lg-5">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username or Email"
              required
            />
          </div>
          <div className="col-12 col-md-6 col-lg-5">
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-outline-light px-4">
            Save Credentials
          </button>
        </div>
      </form>

      {dataList.length > 0 && (
        <div className="table-responsive p-2 p-sm-0 p-md-4 p-lg-5">
          <table className="table table-dark table-hover border-secondary">
            <thead>
              <tr>
                <th>Site</th>
                <th>Username/Email</th>
                <th>Password</th>
                <th>Update</th> 
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataList) &&
                dataList.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <input  className="form-control bg-transparent text-white border-0" type="text" 
                      value={ editingIds.some(([itemId]) => itemId === index)
                        ? updatedData[index].updatedWebsiteName :entry.websiteName} name="updatedWebsiteName" onClick={()=>{toggleEditAndSave(index); }} onChange={(e) => handleUpdate(e,index)} readOnly ={!editingIds.some(([itemId]) => itemId === index)}/>
                    </td>
                    <td>
                      <input  className="form-control bg-transparent text-white border-0" type="text" 
                      value={editingIds.some(([itemId]) => itemId === index)
                        ? updatedData[index].updatedUsername :entry.username} name="updatedUsername" onClick={()=>{toggleEditAndSave(index); }} onChange={(e) => handleUpdate(e,index)} readOnly ={!editingIds.some(([itemId]) => itemId === index)}/>
                    </td>

                    <td>
                      <input  className="form-control bg-transparent text-white border-0" type="text" 
                     value={editingIds.some(([itemId]) => itemId === index)
                        ? updatedData[index].updatedPassword :entry.password} 
                      readOnly={!editingIds.some(([itemId]) => itemId === index)}
                     name="updatedPassword" onChange={(e) => handleUpdate(e,index)}  /></td>
                     
                    <td><button className="btn btn-outline-light px-4" onClick={()=>{toggleEditAndSave(index); }}> 
                      {editingIds.some(([itemId]) => itemId === index) ? "Save" : "Update"}</button></td>
                    <td><button className="btn btn-outline-light px-4" onClick={() =>{deleteData(entry._id)}}>Delete</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
