import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import Step3Report from "../components/Step3Report";

function InterviewReport() {
    const { id } = useParams();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);

                const result = await axios.get(
                    `${ServerUrl}/api/interview/report/${id}`,
                    {
                        withCredentials: true,
                    }
                );

                console.log("Report API Response:", result.data);

                setReport(result.data);
                setError("");
            } catch (err) {
                console.error("Report Fetch Error:", err);

                setError(
                    err?.response?.data?.message ||
                    "Failed to load interview report"
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">
                    Loading Report...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">
                    No Report Found
                </p>
            </div>
        );
    }

    console.log("Passing report to Step3Report:", report);

    return <Step3Report report={report} />;
}

export default InterviewReport;