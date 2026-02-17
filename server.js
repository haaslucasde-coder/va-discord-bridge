import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1398249449641214123/bRgmSFR6BeayxSM1_rutnelv_nLcaA1_ssQYjIkOb6mJXd_UkZiB56w5SQ6pfqcjGtAG";

app.post("/webhook", async (req, res) => {
    const data = req.body;

    // Alleen completed flights posten
    if (data.event !== "flight_completed") {
        return res.status(200).send("Ignored");
    }

    const flight = data.flight;

    const embed = {
        title: `✈️ ${flight.callsign}`,
        description: `**${flight.departure} → ${flight.arrival}**`,
        color: 3447003,
        fields: [
            { name: "Pilot", value: flight.pilot.name, inline: true },
            { name: "Aircraft", value: flight.aircraft, inline: true },
            { name: "Landing Rate", value: `${flight.landing_rate} ft/min`, inline: true },
            { name: "Flight Time", value: `${flight.flight_time}`, inline: true },
            { name: "Distance", value: `${flight.distance} NM`, inline: true }
        ],
        footer: {
            text: "Your Virtual Airline"
        },
        timestamp: new Date()
    };

    await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    });

    res.status(200).send("Posted");
});

app.listen(3000, () => console.log("Server running"));
