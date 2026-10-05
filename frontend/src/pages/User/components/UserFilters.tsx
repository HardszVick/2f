import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import type { FormEvent } from 'react'
import { Role, type Role as UserRole } from '../../../types/user'

type UserFiltersProps = {
  name: string
  role: UserRole | ''
  canClear: boolean
  onNameChange: (name: string) => void
  onRoleChange: (role: UserRole | '') => void
  onApply: () => void
  onClear: () => void
}

const UserFilters = ({
  name,
  role,
  canClear,
  onNameChange,
  onRoleChange,
  onApply,
  onClear,
}: UserFiltersProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onApply()
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{
        px: { xs: 2, sm: 3 },
        py: 2,
        bgcolor: '#fbfcfd',
        borderBottom: 1,
        borderColor: 'divider',
        alignItems: { md: 'center' },
      }}
    >
      <TextField
        label="Nome"
        placeholder="Buscar por nome"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        size="small"
        sx={{ flex: 1 }}
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />

      <FormControl size="small" sx={{ minWidth: { md: 220 } }}>
        <InputLabel id="filtro-perfil-label">Perfil</InputLabel>
        <Select
          labelId="filtro-perfil-label"
          label="Perfil"
          value={role}
          onChange={(event) => onRoleChange(event.target.value as UserRole | '')}
        >
          <MenuItem value="">Todos os perfis</MenuItem>
          <MenuItem value={Role.user}>Usuário</MenuItem>
          <MenuItem value={Role.admin}>Administrador</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" startIcon={<SearchRoundedIcon />}>
        Filtrar
      </Button>
      <Button
        type="button"
        color="inherit"
        startIcon={<FilterAltOffRoundedIcon />}
        onClick={onClear}
        disabled={!canClear}
      >
        Limpar
      </Button>
    </Stack>
  )
}

export default UserFilters
