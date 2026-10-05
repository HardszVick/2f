import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import './index.css'
import UserPage from './pages/User/UserPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#e85d24',
      dark: '#b83d0f',
      contrastText: '#ffffff',
    },
    error: { main: '#c93434' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#17212f', secondary: '#617083' },
    divider: '#dde3e9',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { fontWeight: 750, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafb',
          '& .MuiTableCell-root': {
            color: '#617083',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          },
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserPage />
    </ThemeProvider>
  </StrictMode>,
)
