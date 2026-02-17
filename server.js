import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.get("/", (req, res) => {
    res.send("VA Discord Bridge is running.");
});

app.post("/webhook", async (req, res) => {
    const data = req.body;

    if (!data.flight) {
        return res.status(200).send("No flight data");
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

    res.status(200).send("Posted to Discord");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
