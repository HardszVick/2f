import { Box, Stack, Typography,  } from "@mui/material"
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'

const UserHeader = () => { 
    return <Box
        component="header"
        sx={{
          bgcolor: '#17212f',
          borderBottom: '3px solid',
          borderColor: 'primary.main',
          color: 'common.white',
        }}
      >
        <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 3 }, py: 2.25 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 38,
                height: 38,
                bgcolor: 'primary.main',
                borderRadius: 2,
              }}
            >
              <GroupsOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Painel administrativo
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.65)' }}>
                Gestão de acessos
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
}

export default UserHeader;