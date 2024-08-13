const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        headers: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());
app.use(bodyParser.json());

const WHOIS_API_KEY = process.config.APIKEY;
const WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService";

app.post("/lookup", (req, res) => {
    const { domain, type } = req.body;
    const params = {
        domainName: domain,
        outputFormat: "JSON",
        apiKey: WHOIS_API_KEY,
    };

    request.post(WHOIS_API_URL, { json: params }, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to retrieve WHOIS data" });
        } else {
            const whoisData = body.WhoisRecord;
            let result;
            if (
                whoisData &&
                whoisData.registrant &&
                whoisData.registrant.name
            ) {
                registrantName = whoisData.registrant.name;
            } else {
                registrantName = "Unknown";
            }
            if (type === "domain") {
                result = {
                    domainName: whoisData.domainName,
                    registrar: whoisData.registrarName,
                    registrationDate: whoisData.createdDate,
                    expirationDate: whoisData.expiresDate,
                    estimatedDomainAge: calculateDomainAge(
                        whoisData.createdDate
                    ),
                    hostnames: truncateHostnames(whoisData.nameServers),
                };
            } else if (type === "contact") {
                result = {
                    registrantName: whoisData?.registrant?.name,
                    technicalContactName: whoisData.technicalContact.name,
                    administrativeContactName:
                        whoisData.administrativeContact.name,
                    contactEmail: whoisData.registrant.email,
                };
            }

            res.json(result);
        }
    });
});

app.listen(5000, () => {
    console.log("Server listening on port 5000");
});

function calculateDomainAge(createdDate) {
    const today = new Date();
    const createdDateObj = new Date(createdDate);
    const ageInYears = today.getFullYear() - createdDateObj.getFullYear();
    return ageInYears;
}

let hostnames = [];
function truncateHostnames(hostnames) {
    if (hostnames && hostnames.length > 0) {
        return hostnames.join(", ");
    } else {
        return "";
    }
}
