import React, { useEffect, useState } from "react";
import axios from "axios";
import './Todo.css'; // Make sure you have this CSS file in your components folder

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");

    useEffect(() => {
        fetchTodoList();
    }, []);

    const fetchTodoList = () => {
        axios.get('http://127.0.0.1:3001/getTodoList')
            .then(result => setTodoList(result.data))
            .catch(err => console.error("Error fetching todo list:", err));
    };

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            resetEditableState();
        }
    };

    const resetEditableState = () => {
        setEditableId(null);
        setEditedTask("");
        setEditedStatus("");
        setEditedDeadline("");
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://127.0.0.1:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(() => {
                fetchTodoList();
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
            })
            .catch(err => console.error("Error adding task:", err));
    };

    const saveEditedTask = (id) => {
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const editedData = { task: editedTask, status: editedStatus, deadline: editedDeadline };
        axios.post(`http://127.0.0.1:3001/updateTodoList/${id}`, editedData)
            .then(() => {
                fetchTodoList();
                resetEditableState();
            })
            .catch(err => console.error("Error updating task:", err));
    };

    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            axios.delete(`http://127.0.0.1:3001/deleteTodoList/${id}`)
                .then(() => fetchTodoList())
                .catch(err => console.error("Error deleting task:", err));
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Todo List Manager</h1>
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Your Tasks</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todoList.map((data) => (
                                            <tr key={data._id}>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editedTask}
                                                            onChange={(e) => setEditedTask(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.task
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        >
                                                            <option value="To Do">To Do</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Done">Done</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`badge bg-${getStatusColor(data.status)}`}>
                                                            {data.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="datetime-local"
                                                            className="form-control form-control-sm"
                                                            value={editedDeadline}
                                                            onChange={(e) => setEditedDeadline(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <button className="btn btn-success btn-sm me-1" onClick={() => saveEditedTask(data._id)}>
                                                            <i className="bi bi-check"></i> Save
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-primary btn-sm me-1" onClick={() => toggleEditable(data._id)}>
                                                            <i className="bi bi-pencil"></i> Edit
                                                        </button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteTask(data._id)}>
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Add New Task</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={addTask}>
                                <div className="mb-3">
                                    <label htmlFor="newTask" className="form-label">Task</label>
                                    <input
                                        id="newTask"
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Task"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newStatus" className="form-label">Status</label>
                                    <select
                                        id="newStatus"
                                        className="form-select"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newDeadline" className="form-label">Deadline</label>
                                    <input
                                        id="newDeadline"
                                        className="form-control"
                                        type="datetime-local"
                                        value={newDeadline}
                                        onChange={(e) => setNewDeadline(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">
                                    <i className="bi bi-plus-circle me-2"></i>Add Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to determine badge color based on status
function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'to do':
            return 'secondary';
        case 'in progress':
            return 'warning';
        case 'done':
            return 'success';
        default:
            return 'info';
    }
}

export default Todo;