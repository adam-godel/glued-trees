import React from 'react'
import './input.css'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function Input({ neighbors }) {
    const [content, setContent] = useState('')
    const [result, setResult] = useState('')
    const [count, setCount] = useState(1)
    const [queried, setQueried] = useState([])
    const [disabled, setDisabled] = useState(false)
    async function setHelper(content) {
        setContent(content)
        if (content in neighbors && !queried.includes(content)) {
            setResult(result+`${count}. ${content}: ${neighbors[content].join(', ')}\n`)
            setCount(count+1)
            setQueried([...queried, content])
            if (neighbors[content].length < 3 && content != "START") {
                setDisabled(true)
                setResult(`Found in ${count} Queries`)
            } else {
                // this "wipe" effect is less abrupt but avoids needing to manually delete entered keys 
                for (let i = 0; i < content.length; i++) {
                    await new Promise(r => setTimeout(r, 100));
                    setContent(content.slice(0, content.length-1-i));
                }
            }
        }
    }
    return (
        <>
            <ThemeProvider theme={theme}>
            <TextField 
                id="input" 
                label={disabled ? "Exit Key Found!" : "Key"}
                helperText={result} 
                value={content}
                variant="standard" 
                onChange={(event) => setHelper(event.target.value.toUpperCase())}
                sx={{ whiteSpace: "pre-wrap" }}
                inputProps={{
                    readOnly: disabled,
                    style: {
                        textTransform: 'uppercase',
                        fontSize: 20,
                    }
                }}
                InputLabelProps={{
                    style: {
                        fontSize: 20,
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