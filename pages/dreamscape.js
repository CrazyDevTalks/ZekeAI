import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Nav from "../components/nav";
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "../styles/Home.module.css";
// import Skeleton from "@mui/material/Skeleton";
import Hero from "../components/Hero";
import Form from "../components/Form";

export default function Imagine() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getDalle2 = async (prompt) => {
    if (prompt != "") {
      setError(false);
      setLoading(true);
      axios
        .post(`/api/imagine`, prompt)
        .then((res) => {
          // console.log("first after res", res.data.output.image_url);
          if (!res?.data) {
            setError(true);
          }
          setResults(res.data.output.image_url);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setError(true);
    }
  };

  const [type, setType] = useState("png");

  function download(url) {
    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${prompt}.${type.toLowerCase()}`;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col h-[calc(100%-72px)] md:h-[calc(100%-78px)] justify-start">
      <Hero
        title={"Dreamscape"}
        subtitle={"Intelligence art at your fingertips"}
      />
      <div className={`flex h-[calc(100%-216px)] flex-col`}>
        <Form generateResponse={getDalle2} placeholder={"Generate your art"} type={`dreamscape`} />
        {/* <div className="form-group">
          <input
            className="form-control"
            id="prompt"
            type="text"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <center>
          <button className="btn btn-primary" onClick={getDalle2}>
            Generate
          </button>
        </center> */}

        {error && (
          <p className={[styles.error, { marginTop: 20 }]}>
            Something went wrong. Try again.
          </p>
        )}
        {loading && (
          <center>
            <br/><br/>
            Please wait as Zeke is imagining...
            <br/><br/>
          </center>
        )}
        {/* {loading && <p>Loading...</p>} */}
        <div className={styles.grid}>
          {/* {results?.map((result, idx) => {
            return (
              // <center>
              <center key={idx} className={styles.card}>
                <Image
                  unoptimized
                  width={300}
                  height={300}
                  alt=""
                  // fill
                  className={styles.imgPreview}
                  src={`data:image/png;base64, ${result.image_base64}`}
                  onClick={() => download(result.image_base64)}
                />
              </center>
              // </center>
            );
          })} */}
          {results && (
            <center className={styles.card}>
              <Image
                unoptimized
                width={300}
                height={300}
                alt=""
                // fill
                className={styles.imgPreview}
                src={results}
                onClick={() => download(results)}
              />
            </center>
          )}
        </div>
        <div style={{ marginTop: "50px" }}>{/* <Footer /> */}</div>
      </div>
    </div>
  );
}

// .image_base64
