"use client";

// src/components/NasaPictureOfDay.jsx
import { useState, useEffect } from "react";

export default function NasaPictureOfDay() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY; // guarda tu key en .env
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => setError("No se pudo cargar la imagen del día"));
    }, []);

    if (error) return null; // falla silenciosa, no rompe el CV
    if (!data) return <p>Cargando imagen del día...</p>;

    return (
        <div className="nasa-apod">
            <h3>{data.title}</h3>
            {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} loading="lazy" />
            ) : (
                <iframe src={data.url} title={data.title} allowFullScreen />
            )}
            <p>{data.explanation}</p>
            <span>{data.date}</span>
        </div>
    );
}