import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Role, type User, type UserInput } from '../types/user'

type UsuariosModalProps = {
  open: boolean
  user?: User
  saving: boolean
  onClose: () => void
  onSubmit: (user: UserInput) => void
}

const UsuariosModal = ({
  open,
  user,
  saving,
  onClose,
  onSubmit,
}: UsuariosModalProps) => {
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<UserInput['role']>(user?.role ?? Role.user)
  const [submitted, setSubmitted] = useState(false)

  const nameInvalid = submitted && name.trim().length === 0
  const emailInvalid = submitted && !/^\S+@\S+\.\S+$/.test(email)

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (event) => {
  event.preventDefault()
  setSubmitted(true)

  if (name.trim().length === 0 || !/^\S+@\S+\.\S+$/.test(email)) {
    return
  }

  onSubmit({
    ...(user ? { id: user.id } : {}),
    name: name.trim(),
    email: email.trim(),
    role,
  })
}

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, pr: 7 }}>
          <Typography component="span" variant="h5" sx={{ fontWeight: 750 }}>
            {user ? 'Editar usuário' : 'Novo usuário'}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {user
              ? 'Atualize as informações de acesso deste usuário.'
              : 'Preencha os dados para adicionar uma pessoa à equipe.'}
          </Typography>
          <IconButton
            aria-label="Fechar"
            onClick={onClose}
            disabled={saving}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={nameInvalid}
              helperText={nameInvalid ? 'Informe o nome do usuário.' : ' '}
              autoFocus
              fullWidth
              disabled={saving}
            />
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailInvalid}
              helperText={emailInvalid ? 'Informe um e-mail válido.' : ' '}
              fullWidth
              disabled={saving}
            />
            <FormControl fullWidth disabled={saving}>
              <InputLabel id="usuario-perfil-label">Perfil</InputLabel>
              <Select
                labelId="usuario-perfil-label"
                label="Perfil"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <MenuItem value={Role.user}>Usuário</MenuItem>
                <MenuItem value={Role.admin}>Administrador</MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Administradores podem gerenciar usuários. Usuários comuns possuem
                apenas o acesso padrão ao sistema.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            {user ? 'Salvar alterações' : 'Adicionar usuário'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default UsuariosModal
