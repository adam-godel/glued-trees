import React from 'react'
import './title.css'
import Logo from '../../assets/logo.svg'

export default function Title() {
    return (
        <>
            <img className="title" src={Logo} onClick={() => window.open("/", "_self")}/>
        </>
    )
}