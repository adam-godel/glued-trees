import React from 'react'
import './outro.css'

export default function Outro() {
    return (
        <>
            <h1 style={{marginTop: "1rem"}}>Congratulations!</h1>
            <h2 style={{marginTop: "-0.2rem", marginBottom: "-0.2rem"}}>You just learned how to create the glued trees algorithm!</h2>
            <p>You now have all the information you'll need to understand the Glued Trees notebook, which contains the actual code for the algorithm. You can access it by clicking the button below.</p>
            <button onClick={() => window.open('notebook', "_self")}>Glued Trees Notebook</button>
            <br/><br/>
        </>
    )
}