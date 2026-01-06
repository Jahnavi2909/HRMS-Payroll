import { useEffect, useState } from "react";
import { documentApi } from "../../api/documentApi";
import { useAuth } from "../../contexts/AuthContext";

const EmployeeDocuments = ({ employeeId , refresh}) => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, [employeeId, refresh]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const empId = employeeId || user?.employeeId;
            const res = await documentApi.getEmployeeDocuments(empId);
            setDocuments(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load documents", err);
        } finally {
            setLoading(false);
        }
    };


    const downloadFile = async (doc) => {
        try {
            const response = await documentApi.download(doc.id);

            const blob = new Blob([response.data], {
                type: doc.contentType,
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", doc.fileName);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    if (loading) return <p>Loading documents...</p>;

    return (
        <div>
            <h3>Employee Documents</h3>

            {documents.length === 0 ? (
                <p>No documents found</p>
            ) : (
                <table border="1" width="100%">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Uploaded At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.fileName}</td>
                                <td>{doc.documnetType}</td>
                                <td>{(doc.fileSize / 1024).toFixed(2)} KB</td>
                                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => downloadFile(doc)}>
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeDocuments;
