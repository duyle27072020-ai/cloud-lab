import { useEffect, useState } from "react";

const API_URL = "/api/students";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [editingId, setEditingId] = useState(null);

    // Lấy danh sách sinh viên
    const loadStudents = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            console.log("Danh sách sinh viên:", data);

            setStudents(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách sinh viên:", error);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Thêm hoặc cập nhật sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();

        const student = {
            studentId,
            name,
            email
        };

        try {
            if (editingId) {
                // Câu 61 - PUT
                const response = await fetch(`${API_URL}/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } else {
                // Câu 49 - POST
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            }

            // Xóa dữ liệu form
            setStudentId("");
            setName("");
            setEmail("");
            setEditingId(null);

            // Tải lại danh sách
            await loadStudents();

        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    // Chọn sinh viên để sửa
    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);
    };

    // Hủy sửa
    const cancelEdit = () => {
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");
    };

    // Câu 62 - DELETE
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa sinh viên này không?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            await loadStudents();

        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "40px auto",
                fontFamily: "Arial"
            }}
        >
            <h1>Quản lý sinh viên</h1>

            <form onSubmit={handleSubmit}>
                <h2>
                    {editingId
                        ? "Cập nhật sinh viên"
                        : "Thêm sinh viên"}
                </h2>

                <input
                    type="text"
                    placeholder="MSSV"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    {editingId ? "Cập nhật" : "Thêm sinh viên"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        style={{ marginLeft: "10px" }}
                    >
                        Hủy
                    </button>
                )}
            </form>

            <hr />

            <h2>Danh sách sinh viên</h2>

            {students.length === 0 ? (
                <p>Chưa có sinh viên.</p>
            ) : (
                students.map((student) => (
                    <div
                        key={student._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <p>
                            <strong>MSSV:</strong> {student.studentId}
                        </p>

                        <p>
                            <strong>Họ tên:</strong> {student.name}
                        </p>

                        <p>
                            <strong>Email:</strong> {student.email}
                        </p>

                        <button onClick={() => handleEdit(student)}>
                            Sửa
                        </button>

                        <button
                            onClick={() => handleDelete(student._id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Xóa
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default App;