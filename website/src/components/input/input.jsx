import React from 'react'
import './input.css'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function Input({ neighbors }) {
    const [result, setResult] = useState('')
    const [count, setCount] = useState(1)
    const [queried, setQueried] = useState([])
    const [disabled, setDisabled] = useState(false)
    function setHelper(content) {
        if (content in neighbors && !queried.includes(content)) {
            setResult(result+`${count}. ${content}: ${neighbors[content].join(', ')}\n`)
            setCount(count+1)
            setQueried([...queried, content])
            if (neighbors[content].length < 3 && content != "START")
                setDisabled(true)
        }
    }
    return (
        <>
            <ThemeProvider theme={theme}>
            <TextField 
                id="input" 
                label="Key"
                helperText={result} 
                variant="standard" 
                onChange={(event) => setHelper(event.target.value.toUpperCase())}
                sx={{ whiteSpace: "pre-wrap" }}
                inputProps={{
                    readOnly: disabled,
                    style: {
                        textTransform: 'uppercase',
                    }
                }}
            />
            </ThemeProvider>
        </>
    )
}

const theme = createTheme({
    palette: {
      primary: {
        main: '#017100',
      }
    },
    typography: {
        fontFamily: 'Hind',
    },
})