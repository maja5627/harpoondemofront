import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import env from "react-dotenv";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      let backEndConnection = `10.43.222.83/record/${params.id.toString()}`;
      if (process.env.REACT_APP_BACK_END_URL) {
        backEndConnection = process.env.REACT_APP_BACK_END_URL + `/record/${params.id.toString()}`;
      }
      const response = await fetch(backEndConnection);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      name: form.name,
      position: form.position,
      level: form.level,
    };

    // This will send a post request to update the data in the database.
    let backEndConnection = `10.43.222.83/update/${params.id}`;
    if (process.env.REACT_APP_BACK_END_URL) {
      backEndConnection = process.env.REACT_APP_BACK_END_URL + `/update/${params.id}`;
    }
    await fetch(backEndConnection, {
      method: "POST",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Relation: </label>
          <input
            type="text"
            className="form-control"
            id="position"
            value={form.position}
            onChange={(e) => updateForm({ position: e.target.value })}
          />
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
