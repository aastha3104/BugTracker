import { useState } from "react";
import { useBugs } from "../context/BugContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function CreateBug() {
  const { addBug } = useBugs();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    severity: "Minor",
    assignedTo: "",
    steps: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addBug(formData);

    setFormData({
      title: "",
      description: "",
      priority: "Low",
      severity: "Minor",
      assignedTo: "",
      steps: "",
    });

    navigate("/bugs");
  };

  return (
    <div className="app"><Sidebar /><main className="page">
      <div className="page-top">
        <div>
          <h1>Create New Bug</h1>
          <p>Report a new software issue</p>
        </div>

        <div className="page-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/bugs")}
          >
            All Bugs
          </button>
        </div>
      </div>

      <form className="bug-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bug Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter bug title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the bug"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Severity</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option>Minor</option>
              <option>Major</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Assigned To</label>

          <input
            type="text"
            name="assignedTo"
            placeholder="Developer name"
            value={formData.assignedTo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Steps to Reproduce</label>

          <textarea
            name="steps"
            placeholder={"1. Open login page\n2. Enter credentials\n3. Click Login"}
            rows="5"
            value={formData.steps}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="create-btn">
          Create Bug
        </button>
      </form>
    </main></div>
  );
}

export default CreateBug;