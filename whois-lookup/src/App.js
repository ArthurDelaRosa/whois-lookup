import React, { useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
    const [domain, setDomain] = useState("");
    const [type, setType] = useState("domain");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/lookup", {
                domain,
                type,
            });
            setResult(response.data);
            setError(null);
        } catch (error) {
            setError(error.message);
            setResult(null);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>WHOIS Lookup</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ fontSize: "18px" }}>
                    Enter a Domain:
                    <input
                        type="text"
                        value={domain}
                        onChange={(event) => setDomain(event.target.value)}
                    />
                </label>
                <br />
                <label>
                    Type :{" "}
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                    >
                        <option value="domain">Domain Information</option>
                        <option value="contact">Contact Information</option>
                    </select>
                </label>
                <br />
                <button type="submit" className="look_btn">
                    Lookup
                </button>
            </form>
            {result && (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h2>Result</h2>
                    {type === "domain" ? (
                        <table>
                            <tbody>
                                <tr>
                                    <th>Domain Name</th>
                                    <td>{result.domainName}</td>
                                </tr>
                                <tr>
                                    <th>Registrar</th>
                                    <td>{result.registrar}</td>
                                </tr>
                                <tr>
                                    <th>Registration Date</th>
                                    <td>{result.registrationDate}</td>
                                </tr>
                                <tr>
                                    <th>Expiration Date</th>
                                    <td>{result.expirationDate}</td>
                                </tr>{" "}
                                <tr>
                                    <th>Estimated Domain Age</th>
                                    <td>{result.estimatedDomainAge}</td>
                                </tr>
                                <tr>
                                    <th>Hostnames</th>
                                    <td>{result.hostnames}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <table>
                            <tbody>
                                <tr>
                                    <th>Registrant Name</th>
                                    <td>{result.registrantName}</td>
                                </tr>
                                <tr>
                                    <th>Technical Contact Name</th>
                                    <td>{result.technicalContactName}</td>
                                </tr>
                                <tr>
                                    <th>Administrative Contact Name</th>
                                    <td>{result.administrativeContactName}</td>
                                </tr>
                                <tr>
                                    <th>Contact Email</th>
                                    <td>{result.contactEmail}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {error && (
                <div>
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default App;
