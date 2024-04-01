import { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdSystemUpdateAlt } from "react-icons/md";
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from "react-bootstrap";


function CrudApi() {

    let [data, Setdata] = useState({});
    let [getformdata, Setgetdata] = useState([]);
    let [active, Setactive] = useState(false);
    let [position, Setposition] = useState(-1);
    let [search, Setsearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5)
    let [Error, setError] = useState({});

    useEffect(() => {
        getData();
    },[Setgetdata]);


    let getData = () => {
        axios.get("http://localhost:3000/posts")
            .then((res) => {
                Setgetdata(res.data);
                Setsearch(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    let getInputValue = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        Setdata({ ...data, [name]: value });

        if (name == "image") {
            if (value == '') {
                setError({ ...Error, ['image']: "image is required" });
            }
            else if (value.length < 3) {
                setError({ ...Error, ['image']: "enter image path" });
            }
            else {
                setError({ ...Error, ['image']: "" });
            }
        }
       else if (name == "name") {
            if (value == '') {
                setError({ ...Error, ['name']: "name is required" });
            }
            else if (value.length < 3) {
                setError({ ...Error, ['name']: "name must be 3 length required" });
            }
            else {
                setError({ ...Error, ['name']: "" });
            }
        }
        else if (name == "email") {
            if (value == "") {
                setError({ ...Error, ['email']: "email is required" })
            }
            else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                setError({ ...Error, ['email']: "enter valid email" })
            }
            else {
                setError({ ...Error, ['email']: "" })
            }
        }
        if (name == "phonenum") {
            if (value == "") {
                setError({ ...Error, ['phone']: "please number is required" });
            }
            else {
                setError({ ...Error, ['phone']: "" });
            }
        }
    }

    let submitData = async (e) => {
        e.preventDefault();

        if (e.target.image.value == "") {
            setError({ ...Error, ['image']: "please enter online image path" });
        }
        else if (e.target.name.value == "") {
            setError({ ...Error, ['name']: "name is required" })
        }
        else if (e.target.email.value == "") {
            setError({ ...Error, ['email']: "email is required" });
        }
        else if (e.target.phonenum.value == "") {
            setError({ ...Error, ['hobby']: "phone-number is required" });
        }
        else {
            setError({ ...Error, ['image']: "" });
            setError({ ...Error, ['name']: "" })
            setError({ ...Error, ['email']: "" })
            setError({ ...Error, ['phonenum']: "" })

            if (active) {
                getformdata[position] = data;
                console.log(getformdata);
                Setdata(getformdata);
                Setactive(false);
                alert("data updated succesfully");
                Setdata({});
            }
            else {
                await axios.post("http://localhost:3000/posts", data)
                    .then((res) => {
                        Setdata({});
                        getData();
                        alert("data Added Succesfully");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }
    }

    let deleteData = (id) => {
        axios.delete("http://localhost:3000/posts/" + id)
            .then((res) => {
                getData();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    let updateData = (id) => {
        console.log(id);
        let pos = getformdata.findIndex((v) => v.id == id);
        Setdata(getformdata[pos]);
        Setposition(pos);
        Setactive(true);
    }

    let searchitem = (e) => {
        console.log(search);
        if (search !== "") {
            let filteredData = getformdata.filter((v, i) =>
                v.name.toLowerCase().match(search.toLowerCase())
            );
            Setgetdata(filteredData);
        }
        else {
            getData();
            alert("data not found!...");
        }
    }

    const handlePostsPerPageChange = (value) => {
        setPostsPerPage(value);
        setCurrentPage(1); 
    };

    const lastindex = currentPage * postsPerPage;
    const index = lastindex - postsPerPage;
    const currentPosts = getformdata.slice(index, lastindex);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(getformdata.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <br/>
            <h2>Crud Api App</h2><br />
            <form method="post" onSubmit={(e) => submitData(e)}>
                <table border={1} cellPadding={20} cellSpacing={4} className="formtable">
                    <tr>
                        <td>Enter Image Path</td>
                        <td><input type="text" name="image" value={data.image ? data.image : ""} onChange={(e) => getInputValue(e)} />&nbsp;&nbsp;<span style={{color:"red"}}>{Error.image?Error.image:""}</span></td>
                    </tr>
                    <tr>
                        <td>Enter name</td>
                        <td><input type="text" name="name" value={data.name ? data.name : ""} onChange={(e) => getInputValue(e)} />&nbsp;&nbsp;<span style={{color:"red"}}>{Error.name?Error.name:""}</span></td>
                    </tr>

                    <tr>
                        <td>Enter Email</td>
                        <td><input type="text" name="email" value={data.email ? data.email : ""} onChange={(e) => getInputValue(e)} />&nbsp;&nbsp;<span style={{color:"red"}}>{Error.email?Error.email:""}</span></td>
                    </tr>
                    <tr>
                        <td>Enter Phone number</td>
                        <td><input type="number" name="phonenum" value={data.phonenum ? data.phonenum : ""} onChange={(e) => getInputValue(e)} />&nbsp;&nbsp;<span style={{color:"red"}}>{Error.phonenum?Error.phonenum:""}</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="submit" name="submit" value="submit" className="btn" /></td>
                    </tr>
                </table>
            </form>
            <br /><br />


            
            <div>
                        <select className="form-select" onChange={(e) => handlePostsPerPageChange(parseInt(e.target.value))} style={{width:"200px",marginLeft:"30px"}}>
                            <option value="5">Show 5 Records</option>
                            <option value="10">Show 10 Records</option>
                            <option value="15">Show 15 Records</option>
                        </select>
                    </div>
            <div className="parentsearch">
                <input type="text" name="search" className="search" onChange={(e) => Setsearch(e.target.value)} placeholder="Search by name" />&nbsp;&nbsp;
                {search !== "" ?
                    <button type="button" className="btn" onClick={(e) => searchitem(e)}>search</button>
                    : <button type="button" className="btn" disabled>fill input!..</button>}
            </div>
            <br /><br />
            <Table cellPadding={17} align="center" striped bordered hover className="w-75">
                <tr>
                    <td>ID</td>
                    <td>Image</td>
                    <td>Name</td>
                    <td>email</td>
                    <td>Phone Number</td>
                    <td>actions</td>
                </tr>

                {currentPosts.map((v, i) => {
                    return (
                        <tr>
                            <td>{index + i + 1}</td>
                            <td width="100px" height="100px"><img src={v.image} width="140px" height="120px" style={{ objectFit: "cover" }}></img></td>
                            <td>{v.name}</td>
                            <td>{v.email}</td>
                            <td>{v.phonenum}</td>
                            <td><RiDeleteBin6Fill onClick={(e) => deleteData(v.id)} className="icon"/>&nbsp;&nbsp;&nbsp;&nbsp; <MdSystemUpdateAlt onClick={(e) => updateData(v.id)} className="icon" /></td>
                        </tr>
                    )
                })}
            </Table>
            <br/>
            <Pagination className="parentpagination">
                    {pageNumbers.map(number => (
                        <Pagination.Item key={number} onClick={() => paginate(number)} active={number === currentPage}>
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination>

        </>
    )
}

export default CrudApi;