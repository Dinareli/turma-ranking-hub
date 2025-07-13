import React, { useState } from "react";
import axios from "axios";

interface CreateClassroomProps {
    teacherId: string;
}

const CreateClass: React.FC<CreateClassroomProps> = ({ teacherId }) => {
    const [className, setClassName] = useState("");
    const [passcode, setPasscode] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Generate classroom id (UUID or similar)
        const classroomId = crypto.randomUUID();
        const createdDate = new Date().toISOString();

        try {
            await axios.post("/api/classrooms", {
                id: classroomId,
                teacherId,
                name: className,
                passcode,
                createdDate,
            });
            setSuccess("Classroom created successfully!");
            setClassName("");
            setPasscode("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError("Failed to create classroom.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
            <h2>Create New Classroom</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Classroom Name:
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Passcode:
                        <input
                            type="text"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Classroom"}
                </button>
            </form>
            {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
            {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        </div>
    );
};

export default CreateClass;