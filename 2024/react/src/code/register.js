import React, { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        nationality: "Residence",
        physicallyChallenged: "",
        govtProofs: {
            aadhar: false,
            pan: false,
            license: false
        },
        dob: ""
    })
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;
        console.log(checked, name)
        if (type === "checkbox") {
            setFormData((prevState) => ({
                ...prevState,
                govtProofs: {
                    ...prevState.govtProofs,
                    [name]: checked
                }
            }))
        } else if (type === "radio") {
            setFormData((prevState) => (
                {
                    ...prevState,
                    physicallyChallenged: value
                }
            ))
        } else {
            setFormData((prevState) => (
                {
                    ...prevState,
                    [name]: value
                }
            ))
        }
    }

    const validate = () => {
        const tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Please enter valid email id'
        if (!formData.phone) tempErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone number must be 10 digit";
        if (!formData.physicallyChallenged) tempErrors.physicallyChallenged = "physically Challenged is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.govtProofs.aadhar && !formData.govtProofs.pan && !formData.govtProofs.license) {
            tempErrors.govtProofs = "At least one government proof is required.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setUsers((prevState) => [ ...prevState, formData ])
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} >
                <div>
                    <label>Name</label>
                    <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} /><br /><br />
                    <label>Email</label>
                    <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} /><br /><br />
                    <label>Phone no</label>
                    <input type="number" placeholder="Phone No" name="phone" value={formData.phone} onChange={handleChange} /><br /><br />
                    <label>Address</label>
                    <textarea placeholder="Address" name="address" value={formData.address} onChange={handleChange} /><br /><br />
                    <label>Nationality</label>
                    <select name="nationality" value={formData.nationality} onChange={handleChange}>
                        <option value={'Residence'}>Residence</option>
                        <option value={'Non Residence'}>Non Residence</option>
                    </select><br />
                    <p>Physically Challenged</p>
                    <input type="radio" name="physicallyChallenged" value={'Yes'} checked={formData.physicallyChallenged === 'Yes'} onChange={handleChange} />
                    <label >Yes</label>
                    <input type="radio" name="physicallyChallenged" value={'No'} checked={formData.physicallyChallenged === 'No'} onChange={handleChange} />
                    <label >No</label>
                    <p>Available Govt Proof</p>
                    <input type="checkbox" name="aadhar" checked={formData.govtProofs.aadhar} onChange={handleChange} />
                    <label htmlFor="aadhar">Aadhar</label>
                    <input type="checkbox" name="pan" checked={formData.govtProofs.pan} onChange={handleChange} />
                    <label htmlFor="pan">Pan</label>
                    <input type="checkbox" name="license" checked={formData.govtProofs.license} onChange={handleChange} />
                    <label htmlFor="license">Driving License</label><br /><br />
                    <label>DOB</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} /><br /><br />
                    <button type="submit">Submit</button>
                </div>
            </form>
            {console.log(users)}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Physically Challenged</th>
                        <th>Nationality</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return (
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.dob}</td>
                                <td>{user.physicallyChallenged}</td>
                                <td>{user.nationality}</td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </React.Fragment>
    )

}

export default Register;